import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
