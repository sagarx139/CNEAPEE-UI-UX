import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// Dashboard ke liye saare users fetch karo
router.get('/', async (req, res) => {
    try {
        // Password chupa kar bhejna
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

export default router;