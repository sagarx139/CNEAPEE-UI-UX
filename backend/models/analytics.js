import mongoose from 'mongoose';

const analyticsSchema = mongoose.Schema({
    date: { type: String, required: true, unique: true }, // Format: "YYYY-MM-DD"
    views: { type: Number, default: 0 }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;