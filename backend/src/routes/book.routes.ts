import { Router } from 'express';
import { bookController } from '../controllers/book.controller';
import { bookValidation, validate } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - note
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         note:
 *           type: string
 *           description: Personal note about the book
 *         lastModifiedDate:
 *           type: string
 *           format: date-time
 *           description: Last modification date
 */

const router = Router();

router.use(authMiddleware);

// Debug middleware
router.use((req, res, next) => {
  console.log('[Book Route]', req.method, req.path, req.body);
  next();
});

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', bookController.getBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.get('/:id', bookController.getBookById);

router.post('/', bookValidation.create, validate, bookController.createBook);
router.put('/:id', bookValidation.update, validate, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;