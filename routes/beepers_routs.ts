import express, { Request, Response} from "express";

//ייבוא הקונטולרים
import * as beepersController from "../controllers/beeprs_controllers"
//יצירת מופע של אקספרס
const router = express.Router();
//הפניית האזנות לפונקציות בקונטרולר
router.post(`/`,beepersController.createBeeper)
router.get (`/`,beepersController.getAllBeepers)
router.get (`/:id`,beepersController.getBeepersById)
router.put (`/:id/status`,beepersController.updateBeeperById)
router.delete (`/:id`,beepersController.deleteBeepersById)
router.get (`/status/:status`,beepersController.getBeepersByStatus)

export default router