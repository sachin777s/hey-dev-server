import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Post from "../models/post-model/post.model.js";
import { URL_REGEX } from "../models/user-model/user.constants.js";

// Creating New Post
export const createPost = asyncHandler(async (req, res, next) => {
  let { heading, text, media, parentPostId, rootPostId, community } =
    req.body;
  const user = /*req.user._id*/ "67895c1c30144510c1741c29";

  if (!heading && !text && !media) {
    return next(new ApiError("Provide atleast heading, text or media", 400));
  }

  if (heading.length > 100) {
    return next(new ApiError("Heading must be less then 100 characters", 400));
  }

  if (text.length > 1000) {
    return next(new ApiError("Text must be less then 1000 characters", 400));
  }

  if (media) {
    if (
      !media.type ||
      (media.type !== "image" && media.type !== "video") ||
      !media.url ||
      !URL_REGEX.test(media.url)
    ) {
      return next(new ApiError("Invalid Media Format", 400));
    }
  }

  if (rootPostId || parentPostId) {
    if (
      !mongoose.Types.ObjectId.isValid(rootPostId) ||
      !mongoose.Types.ObjectId.isValid(parentPostId)
    ) {
      return next(new ApiError("Parent ID and Root ID must be Object ID", 400));
    }
  } else {
    rootPostId = null;
    parentPostId = null;
  }

  if (community) {
    if (!mongoose.Types.ObjectId.isValid(community)) {
      return next(new ApiError("Community ID must be Object ID", 400));
    }
  } else {
    community = null;
  }

  await Post.create({
    user,
    heading,
    text,
    media,
    parentPostId,
    rootPostId,
    community,
  });

  res.status(201).json({
    success: true,
    message: "Post Created Successfully",
  });
});
