import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' }, 
  
  // 👇 Plan & Token Tracking
  plan: { 
    type: String, 
    enum: ['free', 'student', 'working', 'coder'], 
    default: 'free' 
  },
  usage: {
    dailyTokens: { type: Number, default: 0 },   // Changed to store Tokens
    monthlyTokens: { type: Number, default: 0 }, // Changed to store Tokens
    lastDailyReset: { type: Date, default: Date.now },
    lastMonthlyReset: { type: Date, default: Date.now } // Monthly reset tracking
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;