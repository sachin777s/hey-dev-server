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

const router = Router();

// Creating New Post
router.post("/", authMiddleware, createPost);

// Updating Existing Post
router.put("/:postId", authMiddleware, updatePost);

// Deleting Existing Post
router.delete("/:postId", authMiddleware, deletePost);

// Getting Posts
router.get("/", authMiddleware, getPosts);

// Like the Post
router.put("/:postId/like", authMiddleware, likePost);

// View the Post
router.put("/:postId/view", authMiddleware, viewPost);

export default router;
