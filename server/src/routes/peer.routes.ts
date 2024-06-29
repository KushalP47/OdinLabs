import Router from 'express';
import { peerController } from "../controllers/peer.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.route("/getOffers").get(verifyJWT, peerController.getOffers) // for admin
router.route("/storeAnswer").post(verifyJWT, peerController.storeAnswer); // for admin

router.route("/storeOffer").post(verifyJWT, peerController.storeOffer); // for student
router.route("/getAnswer").get(verifyJWT, peerController.getAnswer); // for student


export default router;