import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    comments: { type: String, trim: true, maxlength: 1000 }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);