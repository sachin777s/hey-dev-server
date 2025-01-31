import { Router } from "express";
import { clerkAuthProtection } from "../controllers/clerkAuthProtection.js";

const router = Router();

router.get("/", clerkAuthProtection);

export default router;
