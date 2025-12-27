// backend/index.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes Import - Make sure path sahi ho
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js'; 
// import userRoutes from './routes/user.js'; // Agar ye file nahi hai to comment kar dena

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

app.get('/', (req, res) => res.send('<h1>Server is Live! 🚀</h1>'));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(error);
  }
};
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/users', userRoutes);

// --- CRITICAL FIX: PORT 8080 ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Server running on port", PORT));