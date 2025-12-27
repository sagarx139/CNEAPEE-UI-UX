import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
// Email functions import kiye
import { sendWelcomeEmail, sendLoginEmail } from '../email.js';

const router = express.Router();

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        console.log("✅ User Saved");

        // WELCOME MAIL BHEJO
        sendWelcomeEmail(newUser.email, newUser.name);

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ result: newUser, token, message: "User Registered Successfully" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. LOGIN ROUTE (Ab Login Mail Jayega)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // LOGIN MAIL BHEJO (Happy to see you again)
        sendLoginEmail(existingUser.email, existingUser.name);

        res.status(200).json({ result: existingUser, token, message: "Login Successful" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// 3. GOOGLE AUTH ROUTE
router.post('/google', async (req, res) => {
    try {
        const { email, name, picture, sub } = req.body;
        let user = await User.findOne({ email });
        let isNewUser = false;

        if (!user) {
            user = new User({ name, email, googleId: sub, picture });
            await user.save();
            isNewUser = true;
            // Google se naya user -> WELCOME MAIL
            sendWelcomeEmail(user.email, user.name);
        } else {
            // Google se purana user -> LOGIN MAIL
            sendLoginEmail(user.email, user.name);
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ result: user, token, message: "Google Auth Success", firstLogin: isNewUser });
    } catch (error) {
        res.status(500).json({ message: "Google Auth Failed" });
    }
});

export default router;