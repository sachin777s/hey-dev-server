import { Router } from "express";
import {
  createCommunity,
  deleteCommunity,
  gettCommunity,
  updateCommunity,
} from "../controllers/community.js";

const router = Router();

router.post("/", createCommunity);
router.get("/:id", gettCommunity);
router.put("/", updateCommunity);
router.delete("/", deleteCommunity);

export default router;
