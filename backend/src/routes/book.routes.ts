import { Router } from 'express';
import { bookController } from '../controllers/book.controller';
import { bookValidation, validate } from '../middleware/validation.middleware';

const router = Router();

// GET /api/books - Get all books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Get a single book
router.get('/:id', bookValidation.update[0], validate, bookController.getBookById);

// POST /api/books - Create a new book
router.post('/', bookValidation.create, validate, bookController.createBook);

// PUT /api/books/:id - Update a book
router.put('/:id', bookValidation.update, validate, bookController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', bookValidation.update[0], validate, bookController.deleteBook);

export const bookRoutes = router;