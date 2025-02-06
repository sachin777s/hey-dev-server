import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
  updatePost,
  viewPost,
} from "../controllers/post.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const router = Router();

// Creating New Post
router.post("/", requireAuth(), authMiddleware, createPost);

// Updating Existing Post
router.put("/:postId", requireAuth(), authMiddleware, updatePost);

// Deleting Existing Post
router.delete("/:postId", requireAuth(), authMiddleware, deletePost);

// Getting Posts
router.get("/", requireAuth(), authMiddleware, getPosts);

// Like the Post
router.put("/:postId/like", requireAuth(), authMiddleware, likePost);

// View the Post
router.put("/:postId/view", requireAuth(), authMiddleware, viewPost);

export default router;
