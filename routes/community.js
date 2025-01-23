import { Router } from "express";
import {
  createCommunity,
  deleteCommunity,
  getMultipleCommunities,
  gettCommunity,
  updateCommunity,
  joinAndLeftCommunity,
  removeSpamMember,
  gettingCommunityPosts,
} from "../controllers/community.js";
import authController from "../middlewares/authMiddleware.js";

const router = Router();

//Creating a New Community
router.post("/", authController, createCommunity);

// Getting single community
router.get("/:communityId", authController, gettCommunity);

// Getting multiple communities based on limit and page
router.get("/", authController, getMultipleCommunities);

// Updating existing community
router.put("/:communityId", authController, updateCommunity);

// Deleting existing community
router.delete("/:communityId", authController, deleteCommunity);

// Join and Left Community
router.put("/:communityId/join", authController, joinAndLeftCommunity);

// Removing Spam Members from Community
router.put("/:communityId/remove", authController, removeSpamMember);

// Getting Community's Posts
router.get("/posts/get", authController, gettingCommunityPosts);

export default router;
