import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' }
});

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [wishlistItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Wishlist', wishlistSchema);
