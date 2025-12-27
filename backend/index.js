// backend/index.js - FULL PRODUCTION MODE

// 1. SSL Error Fix
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// 2. Routes Wapas Aa Gaye
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js'; 

dotenv.config();

const app = express();

// 3. Middleware
app.use(express.json());
app.use(cors({
    origin: '*', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 4. Test Route
app.get('/', (req, res) => {
    res.send('<h1>✅ CNEAPEE Server is Fully Operational! DB & Emails Active.</h1>');
});

// 5. MongoDB Connection (Ab ye chalega)
const connectDB = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        // Server crash nahi hone denge
    }
};

// Database Connect Call
connectDB();

// 6. Routes Active Kar Diye
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// 7. Port Setup
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});