import BookModel, { Book } from '../models/book.model';
import { NotFoundError } from '../types/error.types';

export class BookService {
  async getAllBooks(userId: string): Promise<Book[]> {
    return BookModel.find({ userId }).sort({ lastModifiedDate: -1 });
  }

  async getBookById(id: string, userId: string): Promise<Book> {
    const book = await BookModel.findOne({ _id: id, userId });
    if (!book) {
      throw new NotFoundError('Book not found');
    }
    return book;
  }

  async createBook(bookData: Partial<Book>): Promise<Book> {
    const book = new BookModel({
      ...bookData,
      lastModifiedDate: new Date()
    });
    return book.save();
  }

  async updateBook(id: string, userId: string, bookData: Partial<Book>): Promise<Book> {
    const book = await BookModel.findOneAndUpdate(
      { _id: id, userId },
      { ...bookData, lastModifiedDate: new Date() },
      { new: true, runValidators: true }
    );
    if (!book) {
      throw new NotFoundError('Book not found');
    }
    return book;
  }

  async deleteBook(id: string, userId: string): Promise<void> {
    const book = await BookModel.findOneAndDelete({ _id: id, userId });
    if (!book) {
      throw new NotFoundError('Book not found');
    }
  }
}

export default new BookService();