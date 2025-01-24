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
export const gettingMessages = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const messages = await Message.find({
    $or: [{ reciever: user._id }, { sender: user._id }],
  });

  res.status(200).json({
    success: true,
    data: messages,
  });
});

// Updating existing message
export const updateMessage = asyncHandler(async (req, res, next) => {
  const { text, image } = req.body;
  const { messageId } = req.params;
  const user = req.user;
  const objectToUdpate = {};

  if (!text && !image) {
    return next(
      new ApiError("Provide atleast one, text or image to update", 400)
    );
  }

  if (text) {
    objectToUdpate.text = text;
  }

  if (image) {
    if (!URL_REGEX.test(image)) {
      return next(new ApiError("Image URL is invalid", 400));
    }
    objectToUdpate.image = image;
  }

  const message = await Message.findById(messageId);

  if (user._id.toString() !== message.sender.toString()) {
    return next(new ApiError("You can't edit this message", 400));
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    objectToUdpate,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Message Updated Successfully",
    data: updatedMessage,
  });
});

// Deleting existing message
export const deleteMessage = asyncHandler(async (req, res, next) => {
  const { messageId } = req.params;
  const user = req.user;

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    return next(new ApiError("Invalid or Missing Message ID", 400));
  }

  const message = await Message.findById(messageId);
  if (!message) {
    return next(new ApiError("Message not found", 400));
  }

  if (user._id.toString() !== message.sender.toString()) {
    return next(new ApiError("You can't delete this message", 400));
  }

  await Message.findByIdAndDelete(messageId);

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});

export const clearChat = asyncHandler(async (req, res, next) => {
  const { recieverId } = req.params;
  const user = req.user;

  if (!recieverId || !mongoose.Types.ObjectId.isValid(recieverId)) {
    return next(new ApiError("Invalid or Missing Reciever ID", 400));
  }

  if (recieverId.toString() === user._id.toString()) {
    return next(new ApiError("Reciever and Sender can't be same"));
  }

  const reciever = await User.findById(recieverId);
  if (!reciever) {
    return next(new ApiError("Invalid or Missing Reciever ID", 400));
  }

  await Message.deleteMany({ sender: user._id, reciever: recieverId });

  res.status(200).json({
    success: true,
    message: "Chats Erased successfully",
  });
});
