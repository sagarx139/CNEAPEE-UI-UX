import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes Import
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// ⭐⭐⭐ FIX: GOOGLE AUTH POPUP BLOCKERS ⭐⭐⭐
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});
// ⭐⭐⭐ END FIX ⭐⭐⭐

// Test Route
app.get('/', (req, res) => res.send('<h1>✅ CNEAPEE Server & AI System Active</h1>'));

// DB Logic
let isConnected = false; 
const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        isConnected = db.connections[0].readyState;
        console.log(`✅ MongoDB Connected Successfully`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
    }
};

app.use(async (req, res, next) => {
    if (!isConnected) await connectDB();
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await connectDB();
});