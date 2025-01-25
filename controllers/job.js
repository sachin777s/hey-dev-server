import mongoose from "mongoose";
import Job from "../models/job-model/job.model.js";
import Company from "../models/company-model/company.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { DATE_REGEX, isLessThanCurrentDate } from "../utils/contants.js";

// Creating New Job
export const createJob = asyncHandler(async (req, res, next) => {
  let {
    role,
    description,
    skills,
    experienceInYear,
    salary,
    locationType,
    location,
    company,
    openings,
    deadline,
  } = req.body;
  const user = req.user;

  if (
    !role ||
    !description ||
    !skills ||
    !salary ||
    !locationType ||
    !company ||
    !deadline
  ) {
    return next(new ApiError("Missing Credentials", 400));
  }

  if (description.length > 2000) {
    return next(new ApiError("Description can't exeed 2000 charcters", 400));
  }

  if (
    !Array.isArray(skills) ||
    skills.some((skill) => typeof skill !== "string")
  ) {
    return next(new ApiError("Invalid Skills format", 400));
  }

  if (experienceInYear < 0) {
    return next(new ApiError("Experience can't be less than 0", 400));
  }

  if (
    typeof salary !== "object" ||
    !salary.minRange ||
    !salary.maxRange ||
    salary.minRange <= 0 ||
    salary.maxRange <= 0
  ) {
    return next(new ApiError("Invalid Salary Format", 400));
  }

  if (salary.minRange === salary.maxRange) {
    return next(new ApiError("Minimum and maximum salary can't be same", 400));
  }

  if (
    locationType !== "Office" &&
    locationType !== "Remote" &&
    locationType !== "Hybrid"
  ) {
    return next(
      new ApiError(
        "Location Type should be 'Office', 'Remote' or 'Hybrid'",
        400
      )
    );
  }

  if (locationType === "Remote") {
    location = null;
  } else {
    if (!location) {
      return next(new ApiError("Location is required", 400));
    }
  }

  if (openings <= 0) {
    return next(new ApiError("Atleast one opening is required", 400));
  }

  if (!DATE_REGEX.test(deadline)) {
    return next(new ApiError("Invalid Date Format", 400));
  }

  if (isLessThanCurrentDate(deadline)) {
    return next(new ApiError("Past Date is not allowed", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(company)) {
    return next(new ApiError("Invalid Company ID", 400));
  }

  const companyExist = await Company.findById(company);

  if (!companyExist) {
    return next(new ApiError("Company not found", 400));
  }

  if (companyExist.owner.toString() !== user._id.toString()) {
    return next(new ApiError("You can't create job on this company page", 400));
  }

  await Job.create({
    role,
    description,
    skills,
    experienceInYear,
    salary,
    locationType,
    location,
    company,
    openings,
    deadline,
  });

  res.status(201).json({
    success: true,
    message: "Job is created",
  });
});

// Updating Existing Job
export const updateJob = asyncHandler(async (req, res, next) => {});

// Deleting Existing Job
export const deleteJob = asyncHandler(async (req, res, next) => {});

// Getting Single JOb
export const getSingleJob = asyncHandler(async (req, res, next) => {});

// Getting Multiple Jobs based on page and limit ( Infinite Scrolling )
export const getMultipleJob = asyncHandler(async (req, res, next) => {});
