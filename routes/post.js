import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
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

export default router;
