import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Apne model ka path check karlena
import { sendWelcomeEmail } from '../email.js'; // Brevo wala function import kiya

const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check agar user pehle se exist karta hai
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Password Hash karna (Security ke liye zaroori h)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Naya User Create karna (DATABASE STEP)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // ⚠️ MAIN STEP: Database mein save kar rahe hain
        // Agar yahan error aaya (DB connection issue), to code catch block m chala jayega
        // Aur email nahi jayega (jo sahi bhi hai)
        await newUser.save(); 
        
        console.log("✅ User saved to Database successfully");

        // 4. EMAIL SENDING (Brevo)
        // Database save hone ke baad hi ye line chalegi
        try {
            console.log("⏳ Sending Welcome Email...");
            await sendWelcomeEmail(newUser.email, newUser.name);
        } catch (emailError) {
            // Agar email fail bhi ho jaye, to user ko rokna nahi chahiye
            console.error("⚠️ User registered but Email failed:", emailError.message);
        }

        // 5. Token Generate karna (Login ke liye)
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET, // Make sure .env mein JWT_SECRET ho
            { expiresIn: "7d" }
        );

        // 6. Success Response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// LOGIN ROUTE (Agar is file m login bhi h to ise aise hi rehne dena)
router.post('/login', async (req, res) => {
    // ... tumhara login logic ...
});

export default router;