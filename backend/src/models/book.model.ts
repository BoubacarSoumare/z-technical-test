import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../types/book.types';

export type BookDocument = IBook & Document;

const bookSchema = new Schema<BookDocument>({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'],
    trim: true
  },
  note: { 
    type: String,
    trim: true
  },
  lastModifiedDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export const Book = mongoose.model<BookDocument>('Book', bookSchema);