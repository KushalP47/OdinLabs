import Router from 'express';
import { authController } from '../controllers/auth.controller';
import { verifyJWT } from '../middleware/auth.middleware';

const router = Router();

router.route('/register').post(authController.register);
// router.post('/login', authController.login);
router.route('/login').post(authController.login);
router.route('/logout').post(verifyJWT, authController.logout);

export default router;