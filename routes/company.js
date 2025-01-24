import { Router } from "express";
import { createCompany, updateCompany, deleteCompany } from "../controllers/company.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Creating New Company
router.post("/", authMiddleware, createCompany);

// Updating Existing Company
router.put("/:companyId", authMiddleware, updateCompany);

// Deleting Existing Company
router.delete("/:companyId", authMiddleware, deleteCompany);
export default router;
