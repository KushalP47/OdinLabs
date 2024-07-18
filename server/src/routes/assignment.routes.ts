import Router from 'express';
import { assignmentController } from '../controllers/assignment.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { verifyIsAdmin } from '../middleware/admin.middleware';

const router = Router();

router.route('/').get(verifyJWT, assignmentController.getAllAssignments);
router.route('/').post(verifyJWT, verifyIsAdmin, assignmentController.createAssignment);
router.route('/:assignmentId').get(verifyJWT, assignmentController.getAssignment);
router.route('/:assignmentId').put(verifyJWT, verifyIsAdmin, assignmentController.updateAssignment);
router.route('/:assignmentId').delete(verifyJWT, verifyIsAdmin, assignmentController.deleteAssignment);
router.route('/updateDeadline/:assignmentId').put(verifyJWT, verifyIsAdmin, assignmentController.updateAssignmentDeadline);

export default router;