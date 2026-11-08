import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: String, phone: String, email: String, address: String,
  items: [{ productId: String, name: String, price: Number, quantity: Number, image: String }],
  totalAmount: Number,
  status: { type: String, default: 'placed' },
  statusHistory: [{ status: String, message: String, updatedAt: Date }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
