import express from 'express';
import User from '../models/user.js';
import Analytics from '../models/analytics.js';
// ✅ Nodemailer hata diya, ab Brevo use karenge
import brevo from '@getbrevo/brevo'; 
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// --- BREVO SETUP (Ye already working hai) ---
const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY; 

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
        console.error("Stats Error:", error);
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

// 3️⃣ SEND PERSONAL EMAIL (Updated to use Brevo)
router.post('/send-personal-email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        const today = getTodayDate();

        // Brevo Email Object
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = `<div style="padding:20px; font-family:sans-serif;">
                                        <h3>Hello from CNEAPEE</h3>
                                        <p>${message}</p>
                                        <br><p style="font-size:12px; color:grey;">Sent via Admin Dashboard</p>
                                     </div>`;
        sendSmtpEmail.sender = { "name": "CNEAPEE Admin", "email": process.env.EMAIL_FROM };
        sendSmtpEmail.to = [{ "email": email }];

        // Send
        await apiInstance.sendTransacEmail(sendSmtpEmail);

        // Track Count
        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { emailsSentToday: 1 } },
            { upsert: true }
        );

        res.json({ message: "Personal email sent successfully!" });
    } catch (error) {
        console.error("Personal Email Error:", error);
        res.status(500).json({ message: "Failed to send email via Brevo" });
    }
});

// 4️⃣ SEND BROADCAST (Updated to use Brevo)
router.post('/send-bulk-email', async (req, res) => {
    const { subject, message } = req.body;
    try {
        const users = await User.find({});
        const emails = users.map(u => u.email);
        const today = getTodayDate();

        if (emails.length === 0) return res.status(400).json({ message: "No users found" });

        // Loop sending via Brevo
        // Note: Brevo Free plan ka rate limit dhyan rakhna (300/day)
        for (const email of emails) {
            const sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = `📢 ${subject}`;
            sendSmtpEmail.htmlContent = `<div style="padding:20px; font-family:sans-serif;">
                                            <h2>Update from CNEAPEE</h2>
                                            <p>${message}</p>
                                            <hr>
                                            <p style="font-size:12px; color:grey;">You received this because you are a user of CNEAPEE.</p>
                                           </div>`;
            sendSmtpEmail.sender = { "name": "CNEAPEE Team", "email": process.env.EMAIL_FROM };
            sendSmtpEmail.to = [{ "email": email }];

            try {
                await apiInstance.sendTransacEmail(sendSmtpEmail);
            } catch (err) {
                console.error(`Failed to send to ${email}`, err);
                // Ek fail hone se loop mat roko, continue karo
            }
        }

        // Count Update
        await Analytics.findOneAndUpdate(
            { date: today },
            { $inc: { emailsSentToday: emails.length } },
            { upsert: true }
        );

        res.json({ message: `Broadcast initiated for ${emails.length} users` });
    } catch (error) {
        console.error("Bulk Email Error:", error);
        res.status(500).json({ message: "Broadcast failed" });
    }
});

export default router;