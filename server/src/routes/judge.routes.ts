import Router from "express";
import { judgeController } from "../controllers/judge.controller";

const router = Router();

router.route('/judge').post(judgeController.submit);

export default router;