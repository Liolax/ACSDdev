import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'; // Plugin for unique validation

const userSchema = new Schema(
  {
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'], 
      minlength: [6, 'Password must be at least 6 characters long'], // Min length validation
      select: false // Prevent password from being selected by default
    },
    role: { 
      type: String, 
      enum: ['buyer', 'seller'], // Restricts valid values
      required: [true, 'Role is required']
    },
    name: { 
      type: String, 
      trim: true 
    }
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
  }
);

// Plugin for unique validation errors
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

// Index for faster search by email
userSchema.index({ email: 1 });

export default model('User', userSchema);
