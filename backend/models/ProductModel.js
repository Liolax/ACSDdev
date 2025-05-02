import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Product name is required'], 
      trim: true, 
      minlength: [3, 'Name must be at least 3 characters long']
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: [0, 'Price cannot be negative']
    },
    image: { 
      type: String, 
      default: '' // Will store the file path  
    },
    description: { 
      type: String, 
      trim: true, 
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: { 
      type: String,
      trim: true,
      default: 'General'
    },
    tags: [{ 
      type: String, 
      trim: true 
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

export default model('Product', productSchema);
