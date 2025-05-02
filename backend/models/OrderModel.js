import mongoose from 'mongoose';
import Decimal from 'decimal.js';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
          validate: {
            validator: (value) => {
              const decimal = new Decimal(value);
              return decimal.isFinite() && decimal.isInteger();
            },
            message: 'Price must be a valid decimal value'
          }
        },
        quantity: { type: Number, required: true },
        image: String,
      },
    ],
    shippingInfo: { type: Object, required: true },
    paymentInfo: { type: Object }, // Set after payment simulation
    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      validate: {
        validator: (value) => {
          const decimal = new Decimal(value);
          return decimal.isFinite() && decimal.isInteger();
        },
        message: 'Total amount must be a valid decimal value'
      }
    },
    status: { type: String, default: 'Pending' }, // "Pending", "Processing", "Shipped", "Delivered"
    paymentStatus: { type: String, default: 'Pending' } // "Pending", "Paid"
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);