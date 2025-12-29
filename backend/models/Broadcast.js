import mongoose from "mongoose";

const broadcastSchema = mongoose.Schema({
  message: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: new Date() }
});

export default mongoose.model("Broadcast", broadcastSchema);