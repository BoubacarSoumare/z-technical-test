import { Router } from 'express';
import { bookController } from '../controllers/book.controller';
import { bookValidation, validate } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

// Debug middleware
router.use((req, res, next) => {
  console.log('[Book Route]', req.method, req.path, req.body);
  next();
});

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookValidation.create, validate, bookController.createBook);
router.put('/:id', bookValidation.update, validate, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;