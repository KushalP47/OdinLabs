import Router from "express";
import { judgeController } from "../controllers/judge.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyIsAdmin } from "../middleware/admin.middleware";
import { verifyNoCustomContestCookie } from "../middleware/customContestCokkie.middleware";
const router = Router();

router.route('/submit').post(verifyJWT, judgeController.submit);
router.route('/storeSubmission').post(verifyJWT, judgeController.storeSubmission);
router.route('/getSubmission').get(verifyJWT, judgeController.getSubmissions);
router.route('/getContestUserProblemStatus/:problemId/:userRollNumber').get(verifyJWT, verifyIsAdmin, judgeController.getContestUserProblemStatus);
export default router;