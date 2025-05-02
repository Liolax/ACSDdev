import mongoose from 'mongoose';
import Decimal from 'decimal.js';

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0,
    validate: {
      validator: (value) => {
        const decimal = new Decimal(value);
        return decimal.isFinite(); // Allow any finite decimal, not just integers
      },
      message: 'Price must be a valid decimal value'
    }
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  image: String
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);