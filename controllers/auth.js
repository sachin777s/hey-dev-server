import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  EMAIL_REGEX,
  USERNAME_REGEX,
} from "../models/user-model/user.constants.js";
import User from "../models/user-model/user.model.js";

//Register new user
export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, username, email } = req.body;
  if (!fullName || !username || !email) {
    return next(new ApiError("Missing Credentials", 400));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(new ApiError("Invalid Email Format", 400));
  }

  if (!USERNAME_REGEX.test(username)) {
    return next(new ApiError("Invalid Username Format", 400));
  }

  const userExist = await User.findOne({ username });
  if (userExist) {
    return next(new ApiError("User Already Exist"));
  }

  await User.create({ fullName, username, email });

  res.status(201).json({
    success: true,
    message: "User Created Successfully",
  });
});

//Login existing user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
});

//Logout user
export const logoutUser = (req, res) => {};
