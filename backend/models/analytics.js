import mongoose from 'mongoose';

const analyticsSchema = mongoose.Schema({
    date: { type: String, required: true, unique: true }, // Format: "YYYY-MM-DD"
    views: { type: Number, default: 0 },
    emailsSentToday: { type: Number, default: 0 } // Quota track karne ke liye
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;