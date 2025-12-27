// backend/index.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
    }
};
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes); // Ye dashboard data layega

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));