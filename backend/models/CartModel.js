import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: String, required: true }, // Store as string for consistency with example
  quantity: { type: Number, default: 1, min: 1 },
  image: { type: String, default: '' }
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);