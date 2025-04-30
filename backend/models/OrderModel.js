import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: String,
      },
    ],
    shippingInfo: { type: Object, required: true },
    paymentInfo: { type: Object }, // will be set after payment simulation
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // "Pending", "Processing", "Shipped", "Delivered"
    paymentStatus: { type: String, default: 'Pending' } // "Pending", "Paid"
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
