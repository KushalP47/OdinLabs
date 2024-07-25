import Router from "express";
import { judgeController } from "../controllers/judge.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { verifyNoCustomContestCookie } from "../middleware/customContestCokkie.middleware";
const router = Router();

router.route('/submit').post(verifyJWT, judgeController.submit);
router.route('/storeSubmission').post(verifyJWT, verifyNoCustomContestCookie, judgeController.storeSubmission);
router.route('/getSubmission').get(verifyJWT, verifyNoCustomContestCookie, judgeController.getSubmissions);

export default router;