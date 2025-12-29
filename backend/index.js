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

// ⭐⭐⭐ 1. CORS SETUP (Sabse Pehle) ⭐⭐⭐
const allowedOrigins = [
  "http://localhost:5173",            
  "https://www.cneapee.com",          
  "https://cneapee.com"               
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // Dev mode mein loose check rakh sakte ho agar dikkat aaye
      return callback(new Error('CORS Policy Error'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-token"],
  optionsSuccessStatus: 200 // Legacy browsers fix
}));

// ⭐⭐⭐ 2. BODY PARSER (Limit 50mb) ⭐⭐⭐
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ⭐⭐⭐ 3. SECURITY HEADERS ⭐⭐⭐
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

// Test Route
app.get('/', (req, res) => res.send('<h1>✅ CNEAPEE Server Active</h1>'));

// DB Logic
let isConnected = false; 
const connectDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        isConnected = db.connections[0].readyState;
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ DB Error: ${error.message}`);
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