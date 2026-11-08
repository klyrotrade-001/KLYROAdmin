import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: String, productName: String,
  customerName: String, rating: Number, comment: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
