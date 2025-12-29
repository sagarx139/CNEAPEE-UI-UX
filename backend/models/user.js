import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' }, 
  // 👇 Naya data jo add kiya limits ke liye
  plan: { 
    type: String, 
    enum: ['free', 'student', 'working', 'coder'], 
    default: 'free' 
  },
  usage: {
    dailyCount: { type: Number, default: 0 },
    monthlyCount: { type: Number, default: 0 },
    lastRequestDate: { type: Date, default: Date.now }
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;