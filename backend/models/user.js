import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' }, 
  
  // 👇 1. TEXT PLAN (For Chat & Coding) - Default: free
  plan: { 
    type: String, 
    enum: ['free', 'neo', 'flow', 'maxx'], 
    default: 'free' 
  },

  // 👇 2. IMAGE PLAN (For Image Gen) - Default: none (Purchase Required)
  imagePlan: {
    type: String,
    enum: ['none', 'gen_ai_first', 'lite', 'excess', 'max'],
    default: 'none' // User must buy a plan to start generating
  },

  // 👇 Usage Tracking
  usage: {
    // Text Token Usage
    dailyTokens: { type: Number, default: 0 },   
    monthlyTokens: { type: Number, default: 0 }, 
    
    // Image Generation Usage
    generatedImages: { type: Number, default: 0 }, 

    lastDailyReset: { type: Date, default: Date.now },
    lastMonthlyReset: { type: Date, default: Date.now }
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;