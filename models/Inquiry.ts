import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String, phone: String, email: String, message: String, type: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
