import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

export const userController = {
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await userService.getUserPreferences(userId);
      res.status(200).json(user.preferences);
    } catch (error) {
      next(error);
    }
  },

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await userService.updateUserPreferences(userId, req.body);
      res.status(200).json(user.preferences);
    } catch (error) {
      next(error);
    }
  }
};