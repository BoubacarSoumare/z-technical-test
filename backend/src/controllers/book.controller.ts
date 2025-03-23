import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';
import { NotFoundError } from '../types/error.types';

export const bookController = {
  // Get all books
  async getAllBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await Book.find().sort({ lastModifiedDate: -1 });
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  },

  // Get a single book by ID
  async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        throw new NotFoundError('Book not found');
      }
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  },

  // Create a new book
  async createBook(req: Request, res: Response) {
    try {
      const book = new Book({
        ...req.body,
        lastModifiedDate: new Date()
      });
      const savedBook = await book.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(400).json({ message: 'Error creating book', error });
    }
  },

  // Update a book
  async updateBook(req: Request, res: Response) {
    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { 
          ...req.body,
          lastModifiedDate: new Date()
        },
        { new: true, runValidators: true }
      );
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json(book);
    } catch (error) {
      res.status(400).json({ message: 'Error updating book', error });
    }
  },

  // Delete a book
  async deleteBook(req: Request, res: Response) {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting book', error });
    }
  }
};