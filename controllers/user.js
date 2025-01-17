import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user-model/user.model.js";
import mongoose from "mongoose";

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

//Update user
export const updateUser = (req, res) => {};

//Following to other user
export const follow = (req, res) => {};

//Getting user's followers
export const getFollowers = (req, res) => {};

//Getting user's followings
export const getFollowings = (req, res) => {};
