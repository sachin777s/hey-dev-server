import { Router } from "express";
import {
  createCompany,
  updateCompany,
  deleteCompany,
  getSingleCompany,
  companyJobs,
} from "../controllers/company.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Creating New Company
router.post("/", authMiddleware, createCompany);

// Updating Existing Company
router.put("/:companyId", authMiddleware, updateCompany);

// Deleting Existing Company
router.delete("/:companyId", authMiddleware, deleteCompany);

// Getting Single Company
router.get("/", authMiddleware, getSingleCompany);

// Getting Company Jobs
router.get("/jobs", authMiddleware, companyJobs);

export default router;
