import { Router } from "express";
import { createPost, updatePost } from "../controllers/post.js";

const router = Router();

//Creating New Post
router.post("/", createPost);
router.put("/:postId", updatePost);

export default router;
