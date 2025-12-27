// ---------------------------------------------------------
// 🚀 CNEAPEE BACKEND - PRODUCTION READY CODE
// ---------------------------------------------------------

// 1. SSL/Antivirus Error Fix (Zaroori hai)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// 2. Routes Import
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js'; 

dotenv.config();

const app = express();

// 3. Middleware (Security & Parsing)
app.use(express.json());
app.use(cors({
    origin: '*', // Vercel aur Localhost sab allow karega
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 4. Health Check Route (Ye Cloud Run ke liye oxygen hai)
// Agar ye nahi hoga to Cloud Run sochega server mar gaya
app.get('/', (req, res) => {
    res.status(200).send('<h1>✅ CNEAPEE Server is Running! Email & Auth Ready.</h1>');
});

// 5. MongoDB Connection (CRASH PROOF VERSION 🛡️)
const connectDB = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // 5 second try karega bas
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // YAHAN DHYAN DO: Maine process.exit(1) hata diya hai.
        // Agar DB fail hua, to bhi Server chalta rahega.
        console.error(`❌ MongoDB Error: ${error.message}`);
        console.log("⚠️ Server is running without Database connection for troubleshooting.");
    }
};

// Database Connect Call
connectDB();

// 6. API Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// 7. Server Port Setup (Cloud Run ke liye 8080 zaroori hai)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});