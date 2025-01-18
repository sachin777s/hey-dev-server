import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user-model/user.model.js";
import mongoose from "mongoose";
import { URL_REGEX } from "../models/user-model/user.constants.js";

// Getting user
export const getUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next(new ApiError("Missing userId", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  const user = await User.findById(userId);

  res.status(200).json({
    message: "success",
    data: user,
  });
});

//Following to other user
export const follow = (req, res) => {};

//Getting user's followers
export const getFollowers = (req, res) => {};

//Getting user's followings
export const getFollowings = (req, res) => {};

/********** Updating User Informations Routes ***********/

//Update user
export const updateUser = (req, res) => {};

// Updating profilePiture
export const updateProfilePicture = asyncHandler(async (req, res, next) => {
  const { profilePicture } = req.body;
  const { userId } = req.params;
  const user = req.user; //passed by middleware

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  //   if (userId !== user._id) {   //Change after creating middleware
  if (false) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  if (profilePicture) {
    if (!URL_REGEX.test(profilePicture)) {
      return next(new ApiError("Invalid Profile Piture URL", 400));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePicture,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Profile Picture Updated Successfully",
    data: updatedUser,
  });
});

//Adding Skills

export const updateSkills = asyncHandler(async (req, res, next) => {
  const { skills } = req.body;
  const { userId } = req.params;
  const user = req.user; //passed by middleware

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  //   if (userId !== user._id) {   //Change after creating middleware
  if (false) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  for (let i = 0; i < skills.length; i++) {
    if (typeof skills[i] !== "string") {
      return next(new ApiError("Invalid Skills Credential"));
    }
    skills[i] = skills[i].trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      skills,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Skills Updated Successfully",
    data: updatedUser,
  });
});
