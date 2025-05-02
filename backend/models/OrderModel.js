import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true
        },
        qty: { type: Number, required: true },
        image: String,
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentInfo: { type: Object },
    itemsPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0.0
    },
    taxPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, default: 'Pending', required: true },
    paymentStatus: { type: String, default: 'Pending', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);