import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: String, required: true }, // Store as string for consistency
  qty: { type: Number, required: true },
  image: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  feedback: {
    type: mongoose.Schema.Types.Mixed,
    default: null
    // Structure: { rating, title, comments, buyer, edited }
  }
});

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String
    },
    paymentInfo: {
      method: String,
      last4: String
    },
    itemsPrice: { type: String, required: true },
    taxPrice: { type: String, required: true },
    shippingPrice: { type: String, required: true },
    totalPrice: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date, default: null },
    status: { type: String, default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);