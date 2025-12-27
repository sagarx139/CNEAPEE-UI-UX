import express from 'express';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Admin Email Setup (Nodemailer for Bulk)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Admin ka Gmail
        pass: process.env.EMAIL_PASS, // App Password
    },
    tls: { rejectUnauthorized: false }
});

// 1. Send Bulk Email
router.post('/send-bulk-email', async (req, res) => {
    const { subject, message } = req.body;
    try {
        const users = await User.find({});
        const emails = users.map(user => user.email);
        
        if (emails.length === 0) return res.status(400).json({ message: "No users found" });

        for (const email of emails) {
            await transporter.sendMail({
                from: `"CNEAPEE Admin" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: `<p>${message}</p><p style="font-size:12px;color:grey;">Sent via CNEAPEE Admin</p>`
            });
        }
        res.json({ message: `Sent to ${emails.length} users` });
    } catch (error) {
        console.error("Bulk Email Error:", error);
        res.status(500).json({ message: 'Email sending failed' });
    }
});

// 2. Delete User
router.delete('/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

export default router;