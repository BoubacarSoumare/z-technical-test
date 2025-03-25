import { BookModel, IBook } from '../models/book.model';
import { NotFoundError } from '../types/error.types';
import userService from './user.service';

export class BookService {
  async getAllBooks(userId: string): Promise<IBook[]> {
    const user = await userService.getUserPreferences(userId);
    const { sortBy, sortOrder } = user.preferences;
    
    return BookModel.find({ userId })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });
  }

  async getBooks(userId?: string): Promise<IBook[]> {
    try {
      const query = userId ? { userId } : {};
      const books = await BookModel.find(query).sort({ lastModifiedDate: -1 });
      return books;
    } catch (error) {
      console.error('Error in getBooks:', error);
      throw error;
    }
  }

  async getBookById(id: string): Promise<IBook> {
    const book = await BookModel.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async createBook(bookData: Partial<IBook>): Promise<IBook> {
    const book = new BookModel({
      ...bookData,
      lastModifiedDate: new Date()
    });
    return book.save();
  }

  async updateBook(id: string, bookData: Partial<IBook>, userId?: string): Promise<IBook | null> {
    // Find book and verify ownership
    const book = await BookModel.findOne({ _id: id, userId });
    if (!book) {
      return null;
    }

    // Update only allowed fields
    Object.assign(book, {
      title: bookData.title,
      author: bookData.author,
      note: bookData.note,
      lastModifiedDate: new Date()
    });

    return await book.save();
  }

  async deleteBook(id: string, userId?: string): Promise<void> {
    const query = userId ? { _id: id, userId } : { _id: id };
    const result = await BookModel.findOneAndDelete(query);
    
    if (!result) {
      throw new Error('Book not found or unauthorized');
    }
  }
}

export default new BookService();