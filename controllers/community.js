import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Community from "../models/community-model/community.model.js";
import { URL_REGEX } from "../models/user-model/user.constants.js";
import mongoose from "mongoose";

// Creating new community
export const createCommunity = asyncHandler(async (req, res, next) => {
  const { name, headline, description, logo, rules } = req.body;
  const user = req.user;

  if (!name || !headline || !description) {
    return next(new ApiError("Missing Credentials", 400));
  }

  if (name.length > 50) {
    return next(
      new ApiError("Community Name must be less then 50 characters", 400)
    );
  }

  if (headline.length > 100) {
    return next(
      new ApiError("Community Headline must be less then 100 characters", 400)
    );
  }

  if (description.length < 50 || description.length > 500) {
    return next(
      new ApiError(
        "Community Description should be over 100 and under 500 characters",
        400
      )
    );
  }

  if (!URL_REGEX.test(logo)) {
    new ApiError("Invalid Logo URL", 400);
  }

  if (rules) {
    let doesContainStrings = rules.every((rule) => typeof rule === "string");
    if (!Array.isArray(rules) || !doesContainStrings) {
      return next(new ApiError("Invalid"));
    }
  }

  const createdCommunity = await Community.create({
    name,
    headline,
    description,
    logo,
    rules,
    creator: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Community Created Successfully",
    data: createdCommunity,
  });
});

// Getting Single Community
export const gettCommunity = asyncHandler(async (req, res, next) => {
  const { communityId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return next(new ApiError("Invalid communityId params", 400));
  }

  const community = await Community.findById(communityId);

  if (!community) {
    return next(new ApiError("Community Not Found", 400));
  }

  res.status(200).json({
    success: true,
    data: community,
  });
});

// Updating Community
export const updateCommunity = (req, res) => {};

// Deleting Existing Community
export const deleteCommunity = (req, res) => {};
