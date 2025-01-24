import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { EMAIL_REGEX, URL_REGEX } from "../models/user-model/user.constants.js";
import Company from "../models/company-model/company.model.js";
import mongoose from "mongoose";

// Creating New Company
export const createCompany = asyncHandler(async (req, res, next) => {
  const {
    name,
    headline,
    description,
    logo,
    website,
    size,
    foundedIn,
    industry,
    email,
    phone,
  } = req.body;
  const user = req.user;

  if (
    !name ||
    !headline ||
    !description ||
    !website ||
    !size ||
    !foundedIn ||
    !industry ||
    !email
  ) {
    return next(new ApiError("Missing Credentials", 400));
  }

  if (headline.length > 100) {
    return next(new ApiError("Headline must be under 100 characters", 400));
  }

  if (description.length > 1000) {
    return next(new ApiError("Description must be under 1000 characters", 400));
  }

  if (logo && !URL_REGEX.test(logo)) {
    return next(new ApiError("Logo URL is not valid", 400));
  }

  if (!URL_REGEX.test(website)) {
    return next(new ApiError("Website URL is not valid", 400));
  }

  if (
    !["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].some(
      (value) => size === value
    )
  ) {
    return next(new ApiError("Invalid company size format", 400));
  }

  if (foundedIn > new Date().getFullYear() || foundedIn < 1800) {
    return next(
      new ApiError(
        `foundedIn field must be between 1800 to ${new Date().getFullYear()}`,
        400
      )
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new ApiError("Invalid email format", 400));
  }

  if (phone && phone.length < 10) {
    return next(new ApiError("Phone Number length should be minimum 10", 400));
  }

  await Company.create({
    name,
    headline,
    description,
    logo,
    website,
    size,
    foundedIn,
    industry,
    email,
    phone,
    owner: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Company Page Created Successfully",
  });
});

// Updating Existing Company
export const updateCompany = asyncHandler(async (req, res, next) => {
  const {
    name,
    headline,
    description,
    logo,
    website,
    size,
    foundedIn,
    industry,
    email,
    phone,
  } = req.body;
  const user = req.user;
  const { companyId } = req.params;
  const objectToUpdate = {};

  if (
    !name &&
    !headline &&
    !description &&
    !website &&
    !size &&
    !foundedIn &&
    !industry &&
    !email &&
    !phone &&
    !logo
  ) {
    return next(new ApiError("Atleat one field is required to update", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return next(new ApiError("Invalid Community ID", 400));
  }

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new ApiError("Company not found", 400));
  }

  if (company.owner.toString() !== user._id) {
    return next(new ApiError("You can't update this compay detail", 400));
  }

  if (name) {
    objectToUpdate.name = name;
  }

  if (headline) {
    if (headline.length > 100) {
      return next(new ApiError("Headline must be under 100 characters", 400));
    }
    objectToUpdate.headline = headline;
  }

  if (description) {
    if (description.length > 1000) {
      return next(
        new ApiError("Description must be under 1000 characters", 400)
      );
    }
    objectToUpdate.description = description;
  }

  if (logo) {
    if (!URL_REGEX.test(logo)) {
      return next(new ApiError("Logo URL is not valid", 400));
    }
    objectToUpdate.logo = logo;
  }

  if (website) {
    if (!URL_REGEX.test(website)) {
      return next(new ApiError("Website URL is not valid", 400));
    }
    objectToUpdate.website = website;
  }

  if (size) {
    if (
      !["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].some(
        (value) => size === value
      )
    ) {
      return next(new ApiError("Invalid company size format", 400));
    }
    objectToUpdate.size = size;
  }

  if (foundedIn) {
    if (foundedIn > new Date().getFullYear() || foundedIn < 1800) {
      return next(
        new ApiError(
          `foundedIn field must be between 1800 to ${new Date().getFullYear()}`,
          400
        )
      );
    }
    objectToUpdate.foundedIn = foundedIn;
  }

  if (industry) {
    objectToUpdate.industry = industry;
  }

  if (email) {
    if (!EMAIL_REGEX.test(email)) {
      return next(new ApiError("Invalid email format", 400));
    }
    objectToUpdate.email = email;
  }

  if (phone) {
    if (phone.length < 10) {
      return next(
        new ApiError("Phone Number length should be minimum 10", 400)
      );
    }
    objectToUpdate.phone = phone;
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    objectToUpdate,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Company Update Successfully",
    data: updatedCompany,
  });
});

export const deleteCompany = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { companyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    return next(new ApiError("Invalid Community ID", 400));
  }

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new ApiError("Company not found", 400));
  }

  if (company.owner.toString() !== user._id) {
    return next(new ApiError("You can't delete this company", 400));
  }

  await Company.findByIdAndDelete(companyId);

  res.status(200).json({
    success: true,
    message: "Company Deleted Successfully",
  });
});
