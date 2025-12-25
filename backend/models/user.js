import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' }, // 'admin' ya 'user'
}, { timestamps: true });

// Agar model pehle se bana hai to wahi use karo, nahi to naya banao
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;