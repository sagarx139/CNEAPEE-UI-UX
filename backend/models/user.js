import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Google walo ke liye optional
  googleId: { type: String },
  picture: { type: String },
  role: { type: String, default: 'user' }, // 'admin' ya 'user'
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;