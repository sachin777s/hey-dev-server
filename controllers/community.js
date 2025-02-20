import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Community from "../models/community-model/community.model.js";
import User from "../models/user-model/user.model.js";
import { URL_REGEX } from "../models/user-model/user.constants.js";
import mongoose from "mongoose";
import Post from "../models/post-model/post.model.js";

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

  const community = await Community.findById(communityId).populate([
    { path: "creator", select: "username fullName profilePicture" },
    { path: "members", select: "profilePicture" },
  ]);

  if (!community) {
    return next(new ApiError("Community Not Found", 400));
  }

  res.status(200).json({
    success: true,
    data: community,
  });
});

// Updating Community
export const updateCommunity = asyncHandler(async (req, res, next) => {
  const { name, headline, description, logo, rules } = req.body;
  const { communityId } = req.params;
  const userId = req.user._id;

  const objectToUpdate = {};
  if (!name && !headline && !description && !logo && !rules) {
    return next(new ApiError("Atleast one field is required to update", 400));
  }

  const community = await Community.findById(communityId);
  if (!community) {
    return next(new ApiError("Community not found", 400));
  }

  if (community.creator.toString() !== userId.toString()) {
    return next(new ApiError("Only owner can edit community details", 400));
  }

  if (name) {
    if (name.length > 50) {
      return next(
        new ApiError("Community Name must be less then 50 characters", 400)
      );
    }
    objectToUpdate.name = name;
  }

  if (headline) {
    if (headline.length > 100) {
      return next(
        new ApiError("Community Headline must be less then 100 characters", 400)
      );
    }
    objectToUpdate.headline = headline;
  }

  if (description) {
    if (description.length < 50 || description.length > 500) {
      return next(
        new ApiError(
          "Community Description should be over 100 and under 500 characters",
          400
        )
      );
    }
    objectToUpdate.description = description;
  }

  if (logo) {
    if (!URL_REGEX.test(logo)) {
      return next(new ApiError("Logo URL is invalid", 400));
    }
    objectToUpdate.logo = logo;
  }

  if (rules) {
    let doesContainStrings = rules.every((rule) => typeof rule === "string");
    if (!Array.isArray(rules) || !doesContainStrings) {
      return next(new ApiError("Invalid"));
    }
    objectToUpdate.rules = rules;
  }

  const updatedCommunity = await Community.findByIdAndUpdate(
    communityId,
    objectToUpdate,
    { new: true, runValidators: true }
  );

  if (!updatedCommunity) {
    return next(new ApiError("Community not found", 400));
  }

  res.status(200).json({
    success: true,
    data: updatedCommunity,
  });
});

// Deleting Existing Community
export const deleteCommunity = asyncHandler(async (req, res, next) => {
  const { communityId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return next(new ApiError("Invalid communityId params", 400));
  }

  const community = await Community.findById(communityId);
  if (!community) {
    return next(new ApiError("Community not found", 400));
  }

  if (community.creator.toString() !== userId.toString()) {
    return next(new ApiError("Only owner can delete community details", 400));
  }

  await Community.findByIdAndDelete(communityId);

  if (!community) {
    return next(new ApiError("Community not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Community Deleted Successfully",
  });
});

// Getting Multiple Communities bases on Limit and Page
export const getMultipleCommunities = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, sortBy = "createdAt" } = req.query;
  const pageNum = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);
  const skip = (pageNum - 1) * pageLimit;

  const communities = await Community.find()
    .sort({ [sortBy]: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate({
      path: "members",
      select: "profilePicture",
    });

  res.status(200).json({
    success: true,
    data: communities,
  });
});

// Joining and Lefting the community
export const joinAndLeftCommunity = asyncHandler(async (req, res, next) => {
  const { communityId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return next(new ApiError("Invalid communityId params", 400));
  }

  const community = await Community.findById(communityId);
  if (!community) {
    return next(new ApiError("Community not found", 400));
  }

  if (community.creator.toString() === user._id) {
    return next(new ApiError("You are owner of this community", 400));
  }

  const isJoined = community.members.includes(user._id);

  let responseMessage = "";
  let updatedCommunity;
  if (isJoined) {
    updatedCommunity = await Community.findByIdAndUpdate(
      communityId,
      {
        $pull: { members: user._id },
        $inc: { memberCount: -1 },
      },
      { new: true }
    ).populate([
      { path: "creator", select: "username fullName profilePicture" },
      { path: "members", select: "profilePicture" },
    ]);
    responseMessage = "Lefted Community Successfully";
  } else {
    updatedCommunity = await Community.findByIdAndUpdate(
      communityId,
      {
        $addToSet: { members: user._id },
        $inc: { memberCount: 1 },
      },
      { new: true }
    ).populate([
      { path: "creator", select: "username fullName profilePicture" },
      { path: "members", select: "profilePicture" },
    ]);
    responseMessage = "Joined Community Successfully";
  }

  res.status(200).json({
    success: true,
    message: responseMessage,
    data: updatedCommunity,
  });
});

export const removeSpamMember = asyncHandler(async (req, res, next) => {
  const { communityId } = req.params;
  const user = req.user;
  const { memberId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return next(new ApiError("Invalid communityId params", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return next(new ApiError("Invalid memberId params", 400));
  }

  const community = await Community.findById(communityId);

  if (!community) {
    return next(new ApiError("Community not found", 400));
  }

  const doesMemberExist = community.members.includes(memberId);

  if (community.creator.toString() !== user._id.toString()) {
    return next(new ApiError("You are not owner of this community"));
  }

  if (doesMemberExist) {
    await Community.findByIdAndUpdate(communityId, {
      $pull: { members: memberId },
      $inc: { memberCount: -1 },
    });
  } else {
    return next(
      new ApiError(`This user is not the member of ${community.name}`)
    );
  }

  res.status(200).json({
    success: true,
    message: "Member Removed Successfully",
  });
});

// Getting community posts
export const gettingCommunityPosts = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    filter,
    communityId,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const pageLimit = parseInt(limit, 10);
  const skip = (pageNum - 1) * pageLimit;
  let sort = {};
  let query = {};

  if (pageLimit > 50) {
    return next(new ApiError("Posts limit must be less then 50", 400));
  }

  if (communityId) {
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return next(new ApiError("Invalid communityId", 400));
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return next(new ApiError("Community not found", 400));
    }
    query = { community: communityId };
  } else {
    query = { community: { $ne: null } };
  }

  switch (filter) {
    case "popular":
      sort = { likesCount: -1 };
      break;

    case "latest":
      sort = { [sortBy]: -1 };
      break;

    case "oldest":
      sort = { [sortBy]: 1 };
      break;

    default:
      sort = { [sortBy]: -1 };
      break;
  }

  const posts = await Post.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "fullName username profilePicture")
    .populate("community", "name")
    .exec();

  res.status(200).json({
    success: true,
    data: posts,
  });
});

// Getting Community's Members
export const gettingCommunityMembers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search } = req.query;
  const { communityId } = req.params;

  const pageNum = parseInt(page, 10);
  const pageLimit = parseInt(limit - 1, 10);
  const skip = (pageNum - 1) * pageLimit;

  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return next(new ApiError("Invalid commuityID", 400));
  }

  // Create a search regex if search query is provided
  const searchQuery = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const community = await Community.findById(communityId)
    .select("members creator")
    .populate("members", "_id");

  if (!community) {
    return next(new ApiError("Community Not Found"));
  }

  let membersIdArray = community.members;

  let members = await User.find({
    _id: { $in: membersIdArray },
    ...searchQuery,
  })
    .select("username fullName profilePicture")
    .skip(skip)
    .limit(parseInt(limit - 1));

  if (pageNum === 1 && !search) {
    const owner = await User.findById(community.creator)
      .select("username fullName profilePicture")
      .lean();
    members = owner ? [owner, ...members] : members;
  }

  res.status(200).json({
    success: true,
    data: members,
  });
});
