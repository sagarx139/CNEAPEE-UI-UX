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
        try {
            await sendWelcomeEmail(newUser.email, newUser.name);
        } catch (err) {
            console.error("Email failed but user registered");
        }

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
        try {
            await sendLoginEmail(existingUser.email, existingUser.name);
        } catch (err) {
            console.error("Login email failed");
        }

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
            try { await sendWelcomeEmail(user.email, user.name); } catch(e){}
        } else {
            // Google se purana user -> LOGIN MAIL
            try { await sendLoginEmail(user.email, user.name); } catch(e){}
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ result: user, token, message: "Google Auth Success", firstLogin: isNewUser });
    } catch (error) {
        res.status(500).json({ message: "Google Auth Failed" });
    }
});

// --- 👇 SECRET ADMIN ROUTE (Sirf tumhare liye) 👇 ---
router.get('/make-me-admin', async (req, res) => {
    try {
        // Tumhari email id hardcode kar di hai
        const targetEmail = "sanskritibhushan139@gmail.com";
        
        const user = await User.findOneAndUpdate(
            { email: targetEmail }, 
            { role: "admin" },
            { new: true } // Return updated user
        );

        if (!user) return res.send(`<h1>❌ User with email ${targetEmail} not found! Pehle Sign Up karo.</h1>`);
        
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">🎉 Success!</h1>
                <h2>${user.name}, You are now an ADMIN.</h2>
                <p>Ab wapas website par jao, <b>Logout</b> karo aur firse <b>Login</b> karo.</p>
                <p>Dashboard ab khul jayega.</p>
            </div>
        `);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;