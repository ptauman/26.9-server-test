import express, { Request, Response} from "express";
import * as beepersController from "../controllers/beeprs_controllers"
const router = express.Router();
router.post(`/`,beepersController.createBeeper)
router.get (`/`,beepersController.getAllBeepers)

export default router