// backend/index.js
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ⚠️ Ise hata dein agar zaroori na ho, ye security risk hai.

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

// ✅ FIX 1: Connection Status Track Karna
let isConnected = false;

const connectDB = async () => {
    // Agar pehle se connected hai, toh return ho jao (time bachega)
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, { 
            serverSelectionTimeoutMS: 5000 
        });
        
        isConnected = db.connections[0].readyState;
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        // Error throw karna zaroori hai taaki request fail ho jaye, 
        // bajaye iske ki wo hang kare
        throw error;
    }
};

// ✅ FIX 2: Middleware jo har request pe DB check karega
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ message: "Database Connection Failed" });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));