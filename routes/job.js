import { Router } from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getSingleJob,
  getMultipleJob,
} from "../controllers/job.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();
// Creating New Job
router.post("/",authMiddleware, createJob);

// Uppating Existing Job
router.put("/:jobId",authMiddleware, updateJob);

// Deleting Existing Job
router.delete("/:jobId",authMiddleware, deleteJob);

// Getting Single Job
router.get("/:jobId",authMiddleware, getSingleJob);

// Getting Multiple Jobs
router.get("/",authMiddleware, getMultipleJob);

export default router;
