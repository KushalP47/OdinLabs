import Router from 'express';
import { assignmentController } from '../controllers/assignment.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { verifyIsAdmin } from '../middleware/admin.middleware';
import { verifyNoCustomContestCookie } from '../middleware/customContestCokkie.middleware';
const router = Router();

router.route('/getAllAssignments').get(verifyJWT, assignmentController.getAllAssignments);
router.route('/create').post(verifyJWT, verifyIsAdmin, assignmentController.createAssignment);
router.route('/:assignmentId').get(verifyJWT, assignmentController.getAssignment);
router.route('/:assignmentId').put(verifyJWT, verifyIsAdmin, assignmentController.updateAssignment);
router.route('/:assignmentId').delete(verifyJWT, verifyIsAdmin, assignmentController.deleteAssignment);
router.route('/updateDeadline/:assignmentId').put(verifyJWT, verifyIsAdmin, assignmentController.updateAssignmentDeadline);
router.route('/getAssignmentDeadline/:assignmentId').get(verifyJWT, assignmentController.getAssignmentDeadline);

export default router;