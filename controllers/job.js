import mongoose from "mongoose";
import Job from "../models/job-model/job.model.js";
import Company from "../models/company-model/company.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { DATE_REGEX, isLessThanCurrentDate } from "../utils/contants.js";
import { query } from "express";

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
export const updateJob = asyncHandler(async (req, res, next) => {
  let {
    role,
    description,
    skills,
    experienceInYear,
    salary,
    locationType,
    location,
    openings,
    deadline,
  } = req.body;
  const user = req.user;
  const { jobId } = req.params;
  const objectToUpdate = {};

  if (
    !role &&
    !description &&
    !skills &&
    !experienceInYear &&
    !salary &&
    !locationType &&
    !location &&
    !openings &&
    !deadline
  ) {
    return next(new ApiError("Provide Atleast one field to update", 400));
  }

  if (role) {
    objectToUpdate.role = role;
  }

  if (description) {
    if (description.length > 2000) {
      return next(new ApiError("Description can't exeed 2000 charcters", 400));
    }
    objectToUpdate.description = description;
  }

  if (skills) {
    if (
      !Array.isArray(skills) ||
      skills.some((skill) => typeof skill !== "string")
    ) {
      return next(new ApiError("Invalid Skills format", 400));
    }
    objectToUpdate.skills = skills;
  }

  if (!experienceInYear) {
    if (experienceInYear < 0) {
      return next(new ApiError("Experience can't be less than 0", 400));
    }
    objectToUpdate.experienceInYear = experienceInYear;
  }

  if (salary) {
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
      return next(
        new ApiError("Minimum and maximum salary can't be same", 400)
      );
    }
    objectToUpdate.salary = salary;
  }

  if (locationType) {
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
    objectToUpdate.locationType = locationType;
  }

  if (locationType === "Remote") {
    objectToUpdate.location = null;
  }

  if (locationType === "Office" || locationType === "Hybrid") {
    if (!location) {
      return next(new ApiError("Location is required with Office or Hybrid"));
    } else {
      objectToUpdate.location = location;
    }
  }

  if (openings) {
    if (openings <= 0) {
      return next(new ApiError("Atleast one opening is required", 400));
    }
    objectToUpdate.openings = openings;
  }

  if (deadline) {
    if (!DATE_REGEX.test(deadline)) {
      return next(new ApiError("Invalid Date Format", 400));
    }

    if (isLessThanCurrentDate(deadline)) {
      return next(new ApiError("Past Date is not allowed", 400));
    }
    objectToUpdate.deadline = deadline;
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return next(new ApiError("Invalid Job ID", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ApiError("Job not found", 400));
  }

  const company = await Company.findById(job.company);

  if (company.owner.toString() !== user._id.toString()) {
    return next(new ApiError("You can't update this job", 400));
  }

  const updatedJob = await Job.findByIdAndUpdate(jobId, objectToUpdate, {
    new: true,
  });

  res.status(201).json({
    success: true,
    message: "Job Updated Successfully",
    data: updatedJob,
  });
});

// Deleting Existing Job
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return next(new ApiError("Invalid Job ID", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ApiError("Job not found", 400));
  }

  const company = await Company.findById(job.company);
  if (user._id.toString() !== company.owner.toString()) {
    return next(new ApiError("You can't delete this job", 400));
  }

  await Job.findByIdAndDelete(jobId);

  res.status(200).json({
    success: true,
    message: "Job Deleted Successfully",
  });
});

// Getting Single Job
export const getSingleJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return next(new ApiError("Invalid Job ID", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ApiError("Job not found", 400));
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

// Getting Multiple Jobs based on page and limit ( Infinite Scrolling )
export const getMultipleJob = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    role,
    experience,
    location,
    locationType,
  } = req.query;
  const pageNum = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);
  const skip = (pageNum - 1) * pageLimit;
  let query = {};

  if (role) {
    query = {
      ...query,
      $or: [
        { role: { $regex: role, $options: "i" } },
        { description: { $regex: role, $options: "i" } },
      ],
    };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (parseInt(experience) >= 0) {
    if (parseInt(experience) > 6) {
      query.experienceInYear = { $gt: parseInt(experience) };
    } else {
      query.experienceInYear = parseInt(experience);
    }
  }

  if (
    locationType === "Remote" ||
    locationType === "Office" ||
    locationType === "Hybrid"
  ) {
    query.locationType = locationType;
  }

  const jobs = await Job.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: jobs,
  });
});

// Apply in job
export const applyInJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return next(new ApiError("Invalid Job ID", 400));
  }
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ApiError("Job not found", 400));
  }

  if (isLessThanCurrentDate(job.deadline)) {
    return next(
      new ApiError("The deadline has passed. You can no longer apply", 400)
    );
  }

  await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: user._id } });

  res.status(200).json({
    success: true,
    message: "Applied Successfully",
  });
});
