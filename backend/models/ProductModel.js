import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    tags: { type: [String], default: [] },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Product', ProductSchema);
