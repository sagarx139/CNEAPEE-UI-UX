import express from 'express';
const router = express.Router();

// Test Route
router.get('/', (req, res) => {
    res.send('User Route Working');
});

// --- YE LINE ZAROORI HAI ---
export default router;