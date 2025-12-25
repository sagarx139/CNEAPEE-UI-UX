import express from 'express';
// 👇 Dhyan dein: Hum 'routes' folder mein hain, isliye '..' lagake bahar nikle
import User from '../models/user.js'; 
import { sendWelcomeEmail, sendWelcomeBackEmail } from '../email.js'; 

const router = express.Router();

// Route: POST /auth/google
router.post("/google", async (req, res) => {
    const { name, email, googleId, picture } = req.body;
    
    console.log(`🔵 Login Request Received for: ${email}`);

    try {
        // 1. Check karein user pehle se hai ya nahi
        let user = await User.findOne({ email });

        if (user) {
            console.log("🟢 Existing User Found. Logging in...");
            
            // Welcome Back Email Bhejo
            await sendWelcomeBackEmail(email, name);

            return res.status(200).json({ 
                message: "Login Successful",
                user, 
                role: user.role, // Frontend ko batao ki ye Admin hai ya User
                firstLogin: false 
            });

        } else {
            console.log("🔵 New User Detected. Creating Account...");

            // 2. Admin Logic: Check karein database mein kitne users hain
            const userCount = await User.countDocuments({});
            
            // Agar ye pehla user hai (count 0), toh 'admin', warna 'user'
            const assignedRole = userCount === 0 ? 'admin' : 'user';

            user = new User({ 
                name, 
                email, 
                googleId, 
                picture, 
                role: assignedRole 
            });

            await user.save();
            console.log(`✅ User Created with role: ${assignedRole}`);

            // Welcome Email Bhejo
            await sendWelcomeEmail(email, name);

            return res.status(201).json({ 
                message: "User Registered",
                user, 
                role: assignedRole, 
                firstLogin: true 
            });
        }

    } catch (err) {
        console.error("❌ AUTH ERROR:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

export default router;