import mongoose, { Document, Schema } from 'mongoose';

// Base interface without _id
interface BookBase {
  title: string;
  author: string;
  note?: string;
  userId: mongoose.Types.ObjectId | string; // Updated type
  lastModifiedDate: Date;
}

// Interface for creating new books
export interface Book extends BookBase {
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for documents from MongoDB
export interface IBook extends Document {
  title: string;
  author: string;
  note: string;
  userId: mongoose.Types.ObjectId; // Updated type
  lastModifiedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  note: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Fixed type
  lastModifiedDate: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  collection: 'books'
});

// Add logging to track saves
bookSchema.pre('save', function(next) {
  console.log('Saving book:', this.toObject());
  next();
});

export const BookModel = mongoose.model<IBook>('Book', bookSchema);
export default BookModel;