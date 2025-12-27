import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js'; 

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

app.get('/', (req, res) => res.send('<h1>✅ Server & Email System Active</h1>'));

// --- ✅ FIX STARTS HERE (Ye naya magic code hai) ---

let isConnected = false; // Track karo ki connection zinda hai ya nahi

const connectDB = async () => {
    // 1. Agar connection pehle se hai, toh wahi use karo
    if (isConnected) {
        return;
    }

    // 2. Agar connection toot gaya hai ya naya server hai, toh connect karo
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, { 
            serverSelectionTimeoutMS: 5000 // 5 second max wait
        });
        
        isConnected = db.connections[0].readyState;
        console.log(`✅ MongoDB Connected via Reconnect Logic`);
    } catch (error) {
        console.error(`❌ MongoDB Reconnect Error: ${error.message}`);
        throw error; // Request fail karo taaki user ko pata chale
    }
};

// Ye Middleware har request se pehle check karega
app.use(async (req, res, next) => {
    try {
        await connectDB(); // Jadoo yahan hai: Har hit pe check hoga
        next();
    } catch (error) {
        console.error("Database connection failed during request");
        res.status(500).json({ error: "Database Connection Error" });
    }
});
// --- ✅ FIX ENDS HERE ---

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));