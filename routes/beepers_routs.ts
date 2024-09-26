import express, { Request, Response} from "express";
import * as beepersController from "../controllers/beeprs_controllers"
const router = express.Router();
router.post(`/`,beepersController.createBeeper)
router.get (`/`,beepersController.getAllBeepers)
router.get (`/:id`,beepersController.getBeepersById)
router.put (`/:id/status`,beepersController.updateBeeperById)
router.delete (`/:id`,beepersController.deleteBeepersById)
router.get (`/status/:status`,beepersController.getBeepersByStatus)

export default router