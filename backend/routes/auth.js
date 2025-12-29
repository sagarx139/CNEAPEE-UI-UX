import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendWelcomeEmail, sendLoginEmail } from '../email.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        // ✅ Initialize Usage Stats
        const newUser = new User({ 
            name, email, password: hashedPassword,
            plan: 'free',
            usage: { dailyTokens: 0, monthlyTokens: 0, lastDailyReset: new Date(), lastMonthlyReset: new Date() }
        });

        await newUser.save();
        
        // 🚀 Non-blocking Email
        sendWelcomeEmail(newUser.email, newUser.name).catch(e => console.log("Email error"));

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ result: newUser, token, message: "Registered" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // 🚀 Non-blocking Email (Fast Login)
        sendLoginEmail(existingUser.email, existingUser.name).catch(e => console.log("Login email error"));

        res.status(200).json({ result: existingUser, token, message: "Login Successful" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// GOOGLE AUTH
router.post('/google', async (req, res) => {
    try {
        const { email, name, picture, sub } = req.body;
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            user = new User({ 
                name, email, googleId: sub, picture,
                plan: 'free',
                usage: { dailyTokens: 0, monthlyTokens: 0, lastDailyReset: new Date(), lastMonthlyReset: new Date() }
            });
            await user.save();
            isNewUser = true;
            sendWelcomeEmail(user.email, user.name).catch(e => {});
        } else {
            sendLoginEmail(user.email, user.name).catch(e => {});
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // Return full user object for frontend usage tracking
        res.status(200).json({ result: user, token, message: "Google Auth Success", firstLogin: isNewUser });
    } catch (error) {
        res.status(500).json({ message: "Google Auth Failed" });
    }
});

export default router;