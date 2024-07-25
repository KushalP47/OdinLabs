import Router from 'express';
import { contestController } from '../controllers/contest.controller';
import { verifyJWT } from '../middleware/auth.middleware';
import { verifyIsAdmin } from '../middleware/admin.middleware';
import { verifyNoCustomContestCookie, verifyCustomContestCookie } from '../middleware/customContestCokkie.middleware';
const router = Router();

router.route('/createContest').post(verifyJWT, verifyIsAdmin, contestController.createContest);
router.route('/getAllContests').get(verifyJWT, verifyNoCustomContestCookie, contestController.getAllContests);
router.route('/:contestId').get(verifyJWT, verifyNoCustomContestCookie, contestController.getContest);
router.route('/:contestId').put(verifyJWT, verifyIsAdmin, contestController.updateContest);
router.route('/:contestId').delete(verifyJWT, verifyIsAdmin, contestController.deleteContest);

router.route('/updateDeadline/:contestId').put(verifyJWT, verifyIsAdmin, contestController.updateContestDeadline);
router.route('/signIn/:contestId').post(verifyJWT, verifyNoCustomContestCookie, contestController.signInContest);
router.route('/logActivity/:contestId').post(verifyJWT, verifyCustomContestCookie, contestController.logContestUserActivity);
router.route('/getContestDeadline/:contestId').get(verifyJWT, verifyCustomContestCookie, contestController.getContestDeadline);
export default router;