import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'; // Plugin for unique validation

const feedbackSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], // Validation message 
      trim: true
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], // Validation message 
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
      trim: true
    },
    message: { 
      type: String, 
      required: [true, 'Message is required'], // Validation message 
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'] // Min length validation
    }
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } // Include virtuals in JSON and object responses
  }
);

// Plugin for unique validation errors
feedbackSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

// Index for faster search by email
feedbackSchema.index({ email: 1 });

export default model('Feedback', feedbackSchema);
