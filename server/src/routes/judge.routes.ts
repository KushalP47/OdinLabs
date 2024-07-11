import Router from "express";
import { judgeController } from "../controllers/judge.controller";
import { verifyJWT } from "../middleware/auth.middleware";
const router = Router();

router.route('/submit').post(verifyJWT, judgeController.submit);
router.route('/storeSubmission').post(verifyJWT, judgeController.storeSubmission);
router.route('/getSubmission').get(verifyJWT, judgeController.getSubmissions);

export default router;