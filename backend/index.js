import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes Import
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js'; // ✅ Chat Route Added

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
// CORS: Filhal '*' rakha hai taaki localhost aur cloud dono pe chale
app.use(cors({ origin: '*', credentials: true }));

// Test Route
app.get('/', (req, res) => res.send('<h1>✅ CNEAPEE Server & AI System Active</h1>'));

// --- 🔌 DATABASE CONNECTION LOGIC (Magic Code) ---
let isConnected = false; 

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        console.log("⏳ Connecting to MongoDB...");
        const db = await mongoose.connect(process.env.MONGO_URI, { 
            serverSelectionTimeoutMS: 5000 // 5 sec mein fail ho jayega agar IP block hua
        });
        
        isConnected = db.connections[0].readyState;
        console.log(`✅ MongoDB Connected Successfully`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        // Agar IP Whitelist issue hai to ye error dega
    }
};

// Har request se pehle DB check karega
app.use(async (req, res, next) => {
    if (!isConnected) {
        await connectDB();
    }
    next();
});
// --- 🔌 END DATABASE LOGIC ---

// ✅ Routes Register
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes); // 👈 Ye zaroori hai Gemini ke liye

// Server Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Server start hote hi ek baar DB connect karne ki koshish karein
    await connectDB();
});