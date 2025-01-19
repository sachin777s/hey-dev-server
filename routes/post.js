import { Router } from "express";
import { createPost } from "../controllers/post.js";

const router = Router();

//Creating New Post
router.post("/", createPost);

export default router;
