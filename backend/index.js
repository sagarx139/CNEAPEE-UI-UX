// backend/index.js - DIAGNOSTIC MODE

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Sirf ye check karne ke liye ki server zinda hai
app.get('/', (req, res) => {
    res.send('<h1>🎉 Server Zinda Hai! (Diagnostic Mode)</h1>');
});

// Port Setup
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Diagnostic Server running on port ${PORT}`);
});