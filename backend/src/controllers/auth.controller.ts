import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
  generateUserId(req: Request, res: Response) {
    const userId = Math.random().toString(36).substring(2);
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ userId, token });
  }
};