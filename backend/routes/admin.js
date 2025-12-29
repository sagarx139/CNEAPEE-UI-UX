import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// --- 🔐 MIDDLEWARE: CHECK SPECIAL ADMIN TOKEN ---
const requireAdminToken = (req, res, next) => {
    const token = req.headers['x-admin-token']; // Special Header
    if (!token) return res.status(401).json({ message: "No Admin Token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'super-admin') {
            next(); // Pass
        } else {
            throw new Error();
        }
    } catch (err) {
        return res.status(403).json({ message: "Invalid Admin Session" });
    }
};

// =========================================================
// 1. ADMIN LOGIN (Issues Special Token)
// =========================================================
router.post('/verify-login', (req, res) => {
    const { id, password } = req.body;
    const ENV_ADMIN_ID = process.env.ADMIN_ID; 
    const ENV_ADMIN_PASS = process.env.ADMIN_PASS;

    console.log("--- ADMIN LOGIN ATTEMPT ---");

    if (!ENV_ADMIN_ID || !ENV_ADMIN_PASS) {
        return res.status(500).json({ success: false, message: "Server Config Error" });
    }

    if (id === ENV_ADMIN_ID && password === ENV_ADMIN_PASS) {
        // ✅ Login Success: Create a Special Token just for Admin Dashboard
        const adminToken = jwt.sign({ role: 'super-admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
        console.log("✅ Admin Token Issued");
        return res.status(200).json({ success: true, token: adminToken, message: "Welcome Boss!" });
    } else {
        console.log("❌ Wrong Credentials");
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }
});

// =========================================================
// 2. DASHBOARD DATA (Protected by requireAdminToken)
// =========================================================
router.get('/stats', requireAdminToken, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const totalUsers = await User.countDocuments();
        let analytics = await Analytics.findOne({ date: today });
        const allAnalytics = await Analytics.find();
        const totalViews = allAnalytics.reduce((acc, curr) => acc + curr.views, 0);

        res.json({ totalUsers, dailyViews: analytics ? analytics.views : 0, totalViews });
    } catch (error) {
        res.status(500).json({ message: "Stats Error" });
    }
});

// 3. GET USERS LIST
router.get('/users', requireAdminToken, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Fetch Users Error" });
    }
});

// 4. UPDATE PLAN
router.put('/update-plan/:id', requireAdminToken, async (req, res) => {
    try {
        const { plan } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
        res.json({ message: "Plan Updated", user });
    } catch (error) {
        res.status(500).json({ message: "Update Failed" });
    }
});

// 5. DELETE USER
router.delete('/delete-user/:id', requireAdminToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete Failed" });
    }
});

// (Public Route for Tracking - No Token Needed)
router.post('/track-view', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        await Analytics.findOneAndUpdate({ date: today }, { $inc: { views: 1 } }, { upsert: true });
        res.sendStatus(200);
    } catch (error) { res.sendStatus(500); }
});

export default router;