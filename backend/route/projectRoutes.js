import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addUserToProjectController,
  getAIMessagesController,
  getAllProjectController,
  projectController,
  storeAIMessageController,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/create", authMiddleware, projectController);
router.get("/allProject", authMiddleware, getAllProjectController);
router.post("/addusertoproject", addUserToProjectController);
router.post("/ai-messagedata",storeAIMessageController);
router.get("/ai-messageget",getAIMessagesController);
export default router;
