import { Router } from "express";
import {
  createCommunity,
  deleteCommunity,
  gettCommunity,
  updateCommunity,
} from "../controllers/community.js";
import authController from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authController, createCommunity);
router.get("/:id", authController, gettCommunity);
router.put("/", authController, updateCommunity);
router.delete("/", authController, deleteCommunity);

export default router;
