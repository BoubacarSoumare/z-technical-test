import { Router } from 'express';
import { bookController } from '../controllers/book.controller';

const router = Router();

// GET /api/books - Get all books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Get a single book
router.get('/:id', bookController.getBookById);

// POST /api/books - Create a new book
router.post('/', bookController.createBook);

// PUT /api/books/:id - Update a book
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', bookController.deleteBook);

export const bookRoutes = router;