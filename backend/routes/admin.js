import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js';

const router = express.Router();

// Helper: Get Today's Date String
const getTodayDate = () => new Date().toISOString().split('T')[0];

// 1️⃣ DASHBOARD STATS (Simplified)
router.get('/stats', async (req, res) => {
    try {
        const today = getTodayDate();
        
        // Total Users
        const totalUsers = await User.countDocuments();
        
        // Daily Views
        let analytics = await Analytics.findOne({ date: today });
        if (!analytics) analytics = { views: 0 };

        // Total Views
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

// 3️⃣ DELETE USER (New Feature) ⚠️
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