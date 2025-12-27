import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// =========================================================
// 🔐 SECURE LOGIN ROUTE (With Debugging Logs 🕵️‍♂️)
// =========================================================
router.post('/verify-login', (req, res) => {
    const { id, password } = req.body;

    // Google Cloud ke Environment Variables se values nikalo
    const ENV_ADMIN_ID = process.env.ADMIN_ID; 
    const ENV_ADMIN_PASS = process.env.ADMIN_PASS;

    // 👇 DEBUGGING LOGS: Cloud Run ke "Logs" tab mein dikhenge
    console.log("---------------- LOGIN DEBUGGER ----------------");
    console.log("1. User Sent ID      :", `'${id}'`);           // Quotes isliye lagaye taaki space dikh jaye
    console.log("2. Cloud Stored ID   :", `'${ENV_ADMIN_ID}'`);
    console.log("3. User Sent Pass    :", `'${password}'`);
    console.log("4. Cloud Stored Pass :", `'${ENV_ADMIN_PASS}'`);
    
    // Check agar variable undefined hai (Set nahi hua)
    if (!ENV_ADMIN_ID || !ENV_ADMIN_PASS) {
        console.log("❌ ERROR: Cloud Run Variables Missing!");
        return res.status(500).json({ success: false, message: "Server Config Error: Variables Missing" });
    }

    // Comparison
    if (id === ENV_ADMIN_ID && password === ENV_ADMIN_PASS) {
        console.log("✅ RESULT: MATCH SUCCESS!");
        return res.status(200).json({ success: true, message: "Welcome Boss!" });
    } else {
        console.log("❌ RESULT: MATCH FAILED");
        return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }
});
// =========================================================


// Helper: Get Today's Date String
const getTodayDate = () => new Date().toISOString().split('T')[0];

// 1️⃣ DASHBOARD STATS
router.get('/stats', async (req, res) => {
    try {
        const today = getTodayDate();
        
        const totalUsers = await User.countDocuments();
        
        let analytics = await Analytics.findOne({ date: today });
        if (!analytics) analytics = { views: 0 };

        const allAnalytics = await Analytics.find();
        const totalViews = allAnalytics.reduce((acc, curr) => acc + curr.views, 0);

        res.json({
            totalUsers,
            dailyViews: analytics.views,
            totalViews: totalViews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching stats" });
    }
});

// 2️⃣ TRACK VIEW
router.post('/track-view', async (req, res) => {
    try {
        const today = getTodayDate();
        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "View counted" });
    } catch (error) {
        res.status(500).json({ message: "Error tracking view" });
    }
});

// 3️⃣ DELETE USER
router.delete('/delete-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

export default router;