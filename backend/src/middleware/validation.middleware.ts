import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

export const bookValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ max: 100 })
      .withMessage('Author cannot exceed 100 characters'),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Note cannot exceed 1000 characters')
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid book ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('author')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Author cannot exceed 100 characters'),
    body('note')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Note cannot exceed 1000 characters')
  ]
};

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};