import { Router } from "express";
import { createCompany } from "../controllers/company.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Creating New Company
router.post("/", authMiddleware, createCompany);

export default router;
