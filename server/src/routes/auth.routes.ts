import Router from 'express';
import { authController } from '../controllers/auth.controller';
import { verifyJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authController.register);
// router.post('/login', authController.login);
router.route('/login').post(authController.login);
router.post('/logout', verifyJWT, authController.logout);

export default router;