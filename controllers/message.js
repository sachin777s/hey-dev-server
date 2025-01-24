import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user-model/user.model.js";
import Message from "../models/message-model/message.model.js";
import { URL_REGEX } from "../models/user-model/user.constants.js";

// Creating a new Message
export const createMessage = asyncHandler(async (req, res, next) => {
  const { reciever, text, image } = req.body;
  const user = req.user;

  if (!text && !image) {
    return next(new ApiError("Provide atleast one, text or image", 400));
  }

  if (image && !URL_REGEX.test(image)) {
    return next(new ApiError("Image URL is invalid", 400));
  }

  if (!reciever || !mongoose.Types.ObjectId.isValid(reciever)) {
    return next(new ApiError("Invalid or Missing Reciever Id", 400));
  }

  const recieverExist = await User.findById(reciever);
  if (!recieverExist) {
    return next(new ApiError("Reciever doesn't exist", 400));
  }

  await Message.create({
    sender: user._id,
    reciever,
    text,
    image,
  });

  res.status(200).json({
    success: true,
    message: "Message Created Successfully",
  });
});

// Getting Messages
export const gettingMessages = (req, res) => {};

// Updating existing message
export const updateMessage = (req, res) => {};

// Deleting existing message
export const deleteMessage = (req, res) => {};
