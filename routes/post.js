import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
  updatePost,
  viewPost,
} from "../controllers/post.js";

const router = Router();

// Creating New Post
router.post("/", createPost);

// Updating Existing Post
router.put("/:postId", updatePost);

// Deleting Existing Post
router.delete("/:postId", deletePost);

// Getting Posts
router.get("/", getPosts);

// Like the Post
router.put("/:postId/like", likePost);

// View the Post
router.put("/:postId/view", viewPost);

export default router;
