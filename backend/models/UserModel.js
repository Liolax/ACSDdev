import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      default: function() {
        return this.role === 'seller' ? 'Demo Seller' : 'Demo Buyer';
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: {
      type: String,
      required: true,
      enum: ['buyer', 'seller'],
      default: 'buyer'
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);