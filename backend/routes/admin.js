import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js'; 
import { adminOnly } from '../middleware/admin.js';

dotenv.config();
const router = express.Router();

// =========================================================
// 🔐 1. SECURE ADMIN LOGIN (Apka Special Code)
// =========================================================
router.post('/verify-login', (req, res) => {
    const { id, password } = req.body;
    
    // Cloud Variables se match karo
    const ENV_ADMIN_ID = process.env.ADMIN_ID; 
    const ENV_ADMIN_PASS = process.env.ADMIN_PASS;

    console.log("--- 🕵️ ADMIN LOGIN ATTEMPT ---");
    // console.log(`User Input: ${id} | ${password}`); // Debugging ke liye on kar sakte ho

    if (!ENV_ADMIN_ID || !ENV_ADMIN_PASS) {
        return res.status(500).json({ success: false, message: "Server Config Error: Variables Missing" });
    }

    if (id === ENV_ADMIN_ID && password === ENV_ADMIN_PASS) {
        console.log("✅ ACCESS GRANTED");
        return res.status(200).json({ success: true, message: "Welcome Boss!" });
    } else {
        console.log("❌ ACCESS DENIED");
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }
});

// =========================================================
// 📊 2. STATS (Dashboard Data)
// =========================================================
const getTodayDate = () => new Date().toISOString().split('T')[0];

router.get('/stats', async (req, res) => {
    try {
        const today = getTodayDate();
        const totalUsers = await User.countDocuments();
        let analytics = await Analytics.findOne({ date: today });
        const allAnalytics = await Analytics.find();
        const totalViews = allAnalytics.reduce((acc, curr) => acc + curr.views, 0);

        res.json({ 
            totalUsers, 
            dailyViews: analytics ? analytics.views : 0, 
            totalViews 
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// =========================================================
// 👥 3. USER MANAGEMENT (Auth + AdminOnly Required)
// =========================================================

// Users List Fetch
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Update Plan
router.put('/update-plan/:id', auth, adminOnly, async (req, res) => {
    try {
        const { plan } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: `Plan updated to ${plan}`, user });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

// Delete User
router.delete('/delete-user/:id', auth, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// Track View
router.post('/track-view', async (req, res) => {
    try {
        const today = getTodayDate();
        await Analytics.findOneAndUpdate({ date: today }, { $inc: { views: 1 } }, { upsert: true });
        res.status(200).json({ message: "View counted" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
});

export default router;