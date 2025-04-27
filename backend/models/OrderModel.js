import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User' }, 
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        feedback: {
          rating: Number,
          title: String,
          comments: String,
          given: { type: Boolean, default: false }
        }
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
    // Root-level feedback can be deprecated if per-item feedback is used
  },
  { timestamps: true }
);

export default model('Order', orderSchema);