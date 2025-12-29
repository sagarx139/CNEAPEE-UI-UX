import mongoose from "mongoose";

const paymentRequestSchema = mongoose.Schema({
  userId: { type: String, required: true },
  userName: String,
  userEmail: String,
  planName: String,
  status: { type: String, default: 'pending' }, // pending, approved
  createdAt: { type: Date, default: new Date() }
});

export default mongoose.model("PaymentRequest", paymentRequestSchema);