import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js';
import Broadcast from '../models/Broadcast.js';
import PaymentRequest from '../models/PaymentRequest.js'; // ✅ NEW MODEL IMPORT
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();
const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// --- 🔐 MIDDLEWARE: CHECK SPECIAL ADMIN TOKEN ---
const requireAdminToken = (req, res, next) => {
    const token = req.headers['x-admin-token']; 
    if (!token) return res.status(401).json({ message: "No Admin Token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'super-admin') next();
        else throw new Error();
    } catch (err) {
        return res.status(403).json({ message: "Invalid Admin Session" });
    }
};

// =========================================================
// 1. ADMIN LOGIN
// =========================================================
router.post('/verify-login', (req, res) => {
    const { id, password } = req.body;
    const ENV_ADMIN_ID = process.env.ADMIN_ID; 
    const ENV_ADMIN_PASS = process.env.ADMIN_PASS;

    if (!ENV_ADMIN_ID || !ENV_ADMIN_PASS) return res.status(500).json({ message: "Config Error" });

    if (id === ENV_ADMIN_ID && password === ENV_ADMIN_PASS) {
        const adminToken = jwt.sign({ role: 'super-admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        return res.status(200).json({ success: true, token: adminToken, message: "Welcome Boss!" });
    } else {
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }
});

// =========================================================
// 2. DASHBOARD DATA (Stats & Users)
// =========================================================
router.get('/stats', requireAdminToken, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const totalUsers = await User.countDocuments();
        let analytics = await Analytics.findOne({ date: today });
        const allAnalytics = await Analytics.find();
        const totalViews = allAnalytics.reduce((acc, curr) => acc + curr.views, 0);
        res.json({ totalUsers, dailyViews: analytics ? analytics.views : 0, totalViews });
    } catch (error) { res.status(500).json({ message: "Stats Error" }); }
});

router.get('/users', requireAdminToken, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) { res.status(500).json({ message: "Fetch Users Error" }); }
});

router.put('/update-plan/:id', requireAdminToken, async (req, res) => {
    try {
        const { plan } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
        res.json({ message: "Plan Updated", user });
    } catch (error) { res.status(500).json({ message: "Update Failed" }); }
});

router.delete('/delete-user/:id', requireAdminToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Deleted" });
    } catch (error) { res.status(500).json({ message: "Delete Failed" }); }
});

router.post('/track-view', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        await Analytics.findOneAndUpdate({ date: today }, { $inc: { views: 1 } }, { upsert: true });
        res.sendStatus(200);
    } catch (error) { res.sendStatus(500); }
});

// =========================================================
// 📢 3. BROADCAST SYSTEM (Banner)
// =========================================================
router.post('/broadcast', requireAdminToken, async (req, res) => {
    try {
        const { message } = req.body;
        await Broadcast.deleteMany({}); // Clear old
        await new Broadcast({ message, isActive: true }).save();
        res.json({ message: "Broadcast Live!" });
    } catch (error) { res.status(500).json({ message: "Failed" }); }
});

router.get('/get-broadcast', async (req, res) => {
    try {
        const broadcast = await Broadcast.findOne({ isActive: true }).sort({ createdAt: -1 });
        res.json(broadcast || { message: "" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

router.delete('/broadcast', requireAdminToken, async (req, res) => {
    try {
        await Broadcast.deleteMany({});
        res.json({ message: "Cleared" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// =========================================================
// 📧 4. EMAIL BROADCAST (Resend)
// =========================================================
router.post('/send-email-broadcast', requireAdminToken, async (req, res) => {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: "Subject/Body missing" });

    try {
        const users = await User.find({}, 'email');
        if (users.length === 0) return res.status(404).json({ message: "No users" });
        
        const emailList = users.map(u => u.email);
        
        // 🚀 Sending via Resend
        await resend.emails.send({
            from: 'CNEAPEE AI <support@cneapee.com>', 
            to: emailList, 
            subject: subject,
            html: `<div style="padding:20px; font-family:sans-serif; color:#333;">
                     <h2 style="color:#4F46E5">${subject}</h2>
                     <p style="font-size:16px;">${message}</p>
                     <hr style="border:0; border-top:1px solid #eee; margin:20px 0;"/>
                     <p style="color:#888; font-size:12px">© Cneapee AI Team</p>
                   </div>`
        });

        res.json({ message: `Emails sent to ${users.length} users!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Email Failed" });
    }
});

// =========================================================
// 💰 5. PAYMENT REQUEST SYSTEM (New Feature)
// =========================================================

// USER: Submit Request (Public Route)
router.post('/submit-payment-request', async (req, res) => {
    const { userId, userName, userEmail, planName } = req.body;
    try {
        // Check duplicate pending request
        const existing = await PaymentRequest.findOne({ userId, status: 'pending' });
        if(existing) return res.status(400).json({ message: "Request already pending!" });

        const newReq = new PaymentRequest({ userId, userName, userEmail, planName });
        await newReq.save();
        res.json({ success: true, message: "Request Sent!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN: Get Pending Requests
router.get('/payment-requests', requireAdminToken, async (req, res) => {
    try {
        const requests = await PaymentRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Error fetching requests" });
    }
});

// ADMIN: Approve & Upgrade
router.post('/approve-payment', requireAdminToken, async (req, res) => {
    const { requestId, userId, planName } = req.body;
    try {
        // 1. Upgrade User Plan
        await User.findByIdAndUpdate(userId, { plan: planName.toLowerCase() });
        
        // 2. Mark Request as Approved
        await PaymentRequest.findByIdAndUpdate(requestId, { status: 'approved' });

        res.json({ message: "User Upgraded Successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Approval Failed" });
    }
});

export default router;