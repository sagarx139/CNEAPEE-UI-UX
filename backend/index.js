// --- IMPORTANT: Antivirus/SSL Error Hatane ke liye (Sabse Upar) ---
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes Import
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js'; 

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Abhi ke liye '*' rakho taaki Vercel se request aa sake
    credentials: true
}));

// Browser Test Route (Taaki "Cannot GET /" na dikhe)
app.get('/', (req, res) => {
  res.send('<h1>Server is Running & Email System is Ready! 🚀</h1>');
});

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); 
  }
};

// Database Connect Call
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
// FORCE UPDATE V1