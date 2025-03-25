import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { AuthRequest } from '../middleware/auth.middleware';

const bookService = new BookService();

export const bookController = {
  getBooks: async (req: AuthRequest, res: Response) => {
    try {
      const books = await bookService.getBooks(req.userId);
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Error fetching books' });
    }
  },

  getBookById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id);
      res.json(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(404).json({ message: 'Book not found' });
    }
  },

  createBook: async (req: AuthRequest, res: Response) => {
    try {
      const bookData = {
        ...req.body,
        userId: req.userId
      };
      const book = await bookService.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ message: 'Error creating book' });
    }
  },

  updateBook: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const book = await bookService.updateBook(id, req.body, req.userId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      res.json(book);
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Error updating book' });
    }
  },

  deleteBook: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await bookService.deleteBook(id, req.userId);
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      
      if (error instanceof Error && error.message === 'Book not found or unauthorized') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Error deleting book' });
    }
  }
};