import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String, image: String,
  itemCount: { type: Number, default: 0 },
}, { timestamps: false });

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
