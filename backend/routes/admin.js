import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js'; // ✅ Ab ye file exist karegi
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Nodemailer Setup (Gmail SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Google Cloud me add karna padega
        pass: process.env.EMAIL_PASS, // Google Cloud me add karna padega
    },
    tls: { rejectUnauthorized: false }
});

// Helper: Get Today's Date String
const getTodayDate = () => new Date().toISOString().split('T')[0];

// 1️⃣ DASHBOARD STATS
router.get('/stats', async (req, res) => {
    try {
        const today = getTodayDate();
        
        const totalUsers = await User.countDocuments();
        
        let analytics = await Analytics.findOne({ date: today });
        if (!analytics) analytics = { views: 0, emailsSentToday: 0 };

        const allAnalytics = await Analytics.find();
        const totalViews = allAnalytics.reduce((acc, curr) => acc + curr.views, 0);

        res.json({
            totalUsers,
            dailyViews: analytics.views,
            totalViews: totalViews,
            emailsSent: analytics.emailsSentToday,
            emailLimit: 300 
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

// 3️⃣ SEND PERSONAL EMAIL
router.post('/send-personal-email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        const today = getTodayDate();

        await transporter.sendMail({
            from: `"CNEAPEE Admin" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: `<div style="padding:20px; font-family:sans-serif;">
                    <h3>Hello from CNEAPEE</h3>
                    <p>${message}</p>
                   </div>`
        });

        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { emailsSentToday: 1 } },
            { upsert: true }
        );

        res.json({ message: "Personal email sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

// 4️⃣ SEND BROADCAST
router.post('/send-bulk-email', async (req, res) => {
    const { subject, message } = req.body;
    try {
        const users = await User.find({});
        const emails = users.map(u => u.email);
        const today = getTodayDate();

        if (emails.length === 0) return res.status(400).json({ message: "No users found" });

        for (const email of emails) {
            await transporter.sendMail({
                from: `"CNEAPEE Admin" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: `<div style="padding:20px; font-family:sans-serif;">
                        <h2>Update from CNEAPEE</h2>
                        <p>${message}</p>
                       </div>`
            });
        }

        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { emailsSentToday: emails.length } },
            { upsert: true }
        );

        res.json({ message: `Broadcast sent to ${emails.length} users` });
    } catch (error) {
        res.status(500).json({ message: "Broadcast failed" });
    }
});

export default router;