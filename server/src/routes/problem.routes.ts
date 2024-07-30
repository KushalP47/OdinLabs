import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import { verifyIsAdmin } from '../middleware/admin.middleware';
const router = Router();

// Import the controller
import { problemController } from '../controllers/problem.controller';

// Create the routes
router.route('/all').get(verifyJWT, problemController.getAllProblems);
router.route('/:problemId').get(verifyJWT, problemController.getProblemById);
router.route('/getProblemByIds').post(verifyJWT, problemController.getProblemsByIds);
router.route('/create').post(verifyJWT, verifyIsAdmin, problemController.createProblem);
router.route('/update/:problemId').put(verifyJWT, verifyIsAdmin, problemController.updateProblem);
router.route('/delete/:problemId').delete(verifyJWT, verifyIsAdmin, problemController.deleteProblem);
router.route('/:problemId/:problemIsHidden').put(verifyJWT, verifyIsAdmin, problemController.changeProblemStatus);

router.route('/editorial/:editorialId').get(verifyJWT, problemController.getEditorialById);
router.route('/:problemId/problemEditorialIsHidden').put(verifyJWT, verifyIsAdmin, problemController.changeProblemEditorialStatus);
// Export the router
export default router;
