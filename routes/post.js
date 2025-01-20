import { Router } from "express";
import { createPost, deletePost, updatePost } from "../controllers/post.js";

const router = Router();

// Creating New Post
router.post("/", createPost);

// Updating Existing Post
router.put("/:postId", updatePost);

// Deleting Existing Post
router.delete("/:postId", deletePost);

export default router;
