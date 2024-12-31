import {
  RegisterController,
  LoginController,
  ProfileController,
  LogoutController,
  getAllUsersController,
} from "../controller/userController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/profile", authMiddleware, ProfileController);
router.get("/logout", LogoutController);
router.get("/alluser",getAllUsersController);

export default router;
