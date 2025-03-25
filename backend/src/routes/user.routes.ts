import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.get('/:userId/preferences', userController.getPreferences);
router.patch('/:userId/preferences', userController.updatePreferences);

export default router;