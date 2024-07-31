import Router from 'express';
import { userController } from '../controllers/user.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { verifyIsAdmin } from '../middleware/admin.middleware';

const router = Router();

router.route('/getUsersFromSection').post(verifyJWT, verifyIsAdmin, userController.getUsersFromSection);
router.route('/getUser/:userRollNumber').get(verifyJWT, verifyIsAdmin, userController.getUser);
router.route('/edituser/:userId').put(verifyJWT, verifyIsAdmin, userController.editUser);
router.route('/deleteuser/:userId').delete(verifyJWT, verifyIsAdmin, userController.deleteUser);
router.route('/changeUserSecret').post(verifyJWT, verifyIsAdmin, userController.changeUserSecret);

export default router;