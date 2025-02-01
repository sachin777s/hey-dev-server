import { Router } from "express";
import { clerkAuthProtection } from "../controllers/clerkAuthProtection.js";

const router = Router();

router.all("/", clerkAuthProtection);

export default router;
