import express from 'express';
import User from '../models/user.js'; // User model import zaroori hai
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// --- EMAIL SETUP (Render Production Fix: Port 587) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Port 587 ke liye false hona chahiye
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: { 
        rejectUnauthorized: false, // Connection timeout fix
        minVersion: 'TLSv1.2'
    },
    connectionTimeout: 20000 // 20 seconds wait time
});

// 1️⃣ GET ALL USERS (Dashboard par dikhane ke liye)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Password chhod kar sab lao
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// 2️⃣ SEND BULK EMAIL (Sabko ek sath)
router.post('/send-bulk-email', async (req, res) => {
    const { subject, message } = req.body;

    try {
        const users = await User.find({});
        const emails = users.map(user => user.email);

        if (emails.length === 0) return res.status(400).json({ message: "No users found" });

        // Loop mein mail bhejo
        for (const email of emails) {
            await transporter.sendMail({
                from: `"CNEAPEE Admin" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                html: `<div style="padding:20px; font-family:sans-serif; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #333;">Message from CNEAPEE Admin</h2>
                        <p>${message}</p>
                        <hr>
                        <p style="font-size: 12px; color: #777;">Sent via CNEAPEE AI Intelligence</p>
                       </div>`
            });
        }

        res.json({ message: `Email sent to ${emails.length} users successfully!` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Email sending failed' });
    }
});

// 3️⃣ DELETE SINGLE USER
router.delete('/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

// 4️⃣ DANGER: DELETE ALL USERS (Userbase saaf) ⚠️
router.delete('/delete-all', async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: 'All users deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Bulk delete failed' });
    }
});

export default router;