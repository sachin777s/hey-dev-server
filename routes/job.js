import { Router } from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getSingleJob,
  getMultipleJob,
  applyInJob,
  getJobApplicants,
} from "../controllers/job.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();
// Creating New Job
router.post("/", authMiddleware, createJob);

// Uppating Existing Job
router.put("/:jobId", authMiddleware, updateJob);

// Deleting Existing Job
router.delete("/:jobId", authMiddleware, deleteJob);

// Getting Single Job
router.get("/:jobId", authMiddleware, getSingleJob);

// Getting Multiple Jobs
router.get("/", authMiddleware, getMultipleJob);

// Apply in the Job
router.put("/:jobId/apply", authMiddleware, applyInJob);

// Get job applicants
router.get("/:jobId/applicants", authMiddleware, getJobApplicants);

export default router;
