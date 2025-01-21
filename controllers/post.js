import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Post from "../models/post-model/post.model.js";
import User from "../models/user-model/user.model.js";
import { URL_REGEX } from "../models/user-model/user.constants.js";

// Creating New Post
export const createPost = asyncHandler(async (req, res, next) => {
  let { heading, text, media, parentPostId, rootPostId, community } = req.body;
  const user = /*req.user._id*/ "67895c1c30144510c1741c29";

  if (!heading && !text && !media) {
    return next(new ApiError("Provide atleast heading, text or media", 400));
  }

  if (heading && heading.length > 100) {
    return next(new ApiError("Heading must be less then 100 characters", 400));
  }

  if (text && text.length > 1000) {
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
    heading = "";
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

// Updating Existing Post
export const updatePost = asyncHandler(async (req, res, next) => {
  const { heading, text, media } = req.body;
  const { postId } = req.params;
  const objectToUpdate = {};

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ApiError("Invalid Post ID", 400));
  }

  if (!heading && !text && !media) {
    return next(new ApiError("Please provide some data to update", 400));
  }

  if (heading) {
    if (heading.length > 100) {
      return next(
        new ApiError("Heading must be less then 100 characters", 400)
      );
    }
    objectToUpdate.heading = heading;
  }

  if (text) {
    if (text.length > 1000) {
      return next(new ApiError("Text must be less then 1000 characters", 400));
    }
    objectToUpdate.text = text;
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
    objectToUpdate.media = media;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { ...objectToUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    return next(new ApiError("Post not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    updatedPost,
  });
});

// Deleting Existing Post
// Recursive method for deleting all the replies
const deletePostAndReplies = async (postId) => {
  const replies = await Post.find({ parentPostId: postId });

  for (const reply of replies) {
    await deletePostAndReplies(reply._id); //Recursive call for nested replies
  }

  await Post.findByIdAndDelete(postId);
};

export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ApiError("Invalid Post ID", 400));
  }

  const postExist = await Post.findById(postId);
  if (!postExist) {
    return next(new ApiError("Post not found", 400));
  }

  await deletePostAndReplies(postId);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

export const getPosts = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortBy = "createdAt" } = req.query;

  const pageNum = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);
  const skip = (pageNum - 1) * pageLimit;

  if (pageLimit > 50) {
    return next(new ApiError("Posts limit must be less then 50", 400));
  }

  const posts = await Post.find()
    .sort({ [sortBy]: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      posts,
    },
  });
});

// Getting User's Posts
export const likePost = asyncHandler(async (req, res, next) => {
  const userId = /*req.user._id */ "678a6228c557baa63975fc36";
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ApiError("Invalid Post ID", 400));
  }

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError("Post not found", 400));
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
    { new: true }
  );

  res.status(200).json({
    message: isLiked ? "Post Unliked Successfully" : "Post Liked Successfully",
    data: {
      likesCount: updatedPost.likes.length,
      likes: updatedPost.likes,
    },
  });
});

//View Post
export const viewPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return next(new ApiError("Invaid Post ID", 400));
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!updatedPost) {
    return next(new ApiError("Post not found"));
  }

  res.status(200).json({
    success: true,
    message: "Post View Udpated Successfully",
    data: {
      views: updatedPost.views,
    },
  });
});
