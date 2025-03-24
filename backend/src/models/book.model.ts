import mongoose, { Document, Schema } from 'mongoose';

export interface IBook {
  title: string;
  author: string;
  note?: string;
  lastModifiedDate: Date;
}

export interface BookDocument extends IBook, Document {
  _id: mongoose.Types.ObjectId;
}

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