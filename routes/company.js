import { Router } from "express";
import { createCompany, updateCompany } from "../controllers/company.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Creating New Company
router.post("/", authMiddleware, createCompany);

// Updating Existing Company
router.put("/:companyId", authMiddleware, updateCompany);

export default router;
