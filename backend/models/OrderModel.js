import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered'],
      default: 'Processing',
    },
    shippingDetails: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    date: { type: Date, default: Date.now },
    // Add feedback info here for easier queries
    feedback: {
      rating: Number,
      title: String,
      comments: String,
      given: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default model('Order', orderSchema);