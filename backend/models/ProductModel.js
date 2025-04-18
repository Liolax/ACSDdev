import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Product name is required'], 
      trim: true, 
      minlength: [3, 'Name must be at least 3 characters long'] // Min length validation
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: [0, 'Price cannot be negative'] // Min price validation
    },
    image: { 
      type: String, 
      default: '', // Default value for image
      validate: { 
        validator: function (v) {
          return v ? /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(v) : true; // URL format validation
        },
        message: props => `${props.value} is not a valid image URL`
      }
    },
    description: { 
      type: String, 
      trim: true, 
      maxlength: [500, 'Description cannot exceed 500 characters'] // Max length validation
    }
  },
  { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
);

// Index for faster text search on name and description
productSchema.index({ name: 'text', description: 'text' });

export default model('Product', productSchema);
