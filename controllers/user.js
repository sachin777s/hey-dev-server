import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user-model/user.model.js";
import mongoose from "mongoose";
import {
  URL_REGEX,
  USERNAME_REGEX,
} from "../models/user-model/user.constants.js";
import Community from "../models/community-model/community.model.js";

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
export const followUnfollow = asyncHandler(async (req, res, next) => {
  const { userIdToToggle } = req.body;
  const currentUserId = req.user._id;

  if (userIdToToggle === currentUserId) {
    return next(new ApiError("You cannot follow or unfollow yourself", 400));
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(userIdToToggle);

  if (!currentUser || !targetUser) {
    return next(new ApiError("User not found", 400));
  }

  const isFollowing = currentUser.followings.includes(userIdToToggle);

  if (isFollowing) {
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { followings: userIdToToggle },
    });

    await User.findByIdAndUpdate(userIdToToggle, {
      $pull: { followers: currentUserId },
    });

    return res.status(200).json({ message: "Unfollowed successfully" });
  } else {
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { followings: userIdToToggle }, // Prevent duplicates
    });

    await User.findByIdAndUpdate(userIdToToggle, {
      $addToSet: { followers: currentUserId }, // Prevent duplicates
    });

    return res.status(201).json({ message: "Followed successfully" });
  }
});

//Getting user's followers
export const getFollowers = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const userExist = await User.findById(user._id)
    .select("followers")
    .populate("followers", "fullName username profilePicture");

  if (!userExist) {
    return next(new ApiError("User not found", 400));
  }

  const followers = userExist.followers;

  res.status(200).json({
    success: true,
    data: { followers },
  });
});

//Getting user's followings
export const getFollowings = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const userExist = await User.findById(user._id)
    .select("followings")
    .populate("followings", "fullName username profilePicture");

  if (!userExist) {
    return next(new ApiError("User not found", 400));
  }

  const followings = userExist.followings;

  res.status(200).json({
    success: true,
    data: { followings },
  });
});

// Getting user's communities
export const getUserCommunities = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userId", 400));
  }

  const ownedCommunities = await Community.find({ creator: userId }).select(
    "name logo memberCount"
  );

  const participatingCommunities = await Community.find({
    members: { $in: [userId] },
  }).select("name logo memberCount");

  res.status(200).json({
    success: true,
    data: [...ownedCommunities, ...participatingCommunities],
  });
});

/********** Updating User Informations Routes ***********/

//Update user
export const updateUser = asyncHandler(async (req, res, next) => {
  const { fullName, username, headline, about } = req.body;
  const { _id } = req.user;
  const objectToUpdate = {};

  if (username) {
    if (!USERNAME_REGEX.test(username))
      return next(new ApiError("Invalid Username"));
    objectToUpdate.username = username;
  }

  if (headline !== null) {
    if (headline?.length > 100)
      return next(new ApiError("Headline length must be less then 100"));
    objectToUpdate.headline = headline;
  }

  if (about !== null) {
    if (about?.length > 500)
      return next(new ApiError("About length must be less then 500"));
    objectToUpdate.about = about;
  }

  if (fullName) {
    objectToUpdate.fullName = fullName;
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      ...objectToUpdate,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new new ApiError("User not found", 400)());
  }

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    data: updatedUser,
  });
});

// Updating profilePiture
export const updateProfilePicture = asyncHandler(async (req, res, next) => {
  const { profilePicture } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
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
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  for (let i = 0; i < skills.length; i++) {
    if (typeof skills[i] !== "string") {
      return next(new ApiError("Invalid Skills Credentials"));
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

// Updating Projects
export const updateProjects = asyncHandler(async (req, res, next) => {
  const { projects } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  for (let i = 0; i < projects.length; i++) {
    if (
      typeof projects[i] !== "object" ||
      !projects[i].gitUrl ||
      !projects[i].hostUrl
    ) {
      return next(new ApiError("Invalid Projects Credentials", 401));
    }

    if (
      !URL_REGEX.test(projects[i].gitUrl) ||
      !URL_REGEX.test(projects[i].hostUrl)
    ) {
      return next(new ApiError("All Values must be URLs", 401));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      projects,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Projects Updated Successfully",
    data: updatedUser,
  });
});

// Updating Education
export const udpateEducation = asyncHandler(async (req, res, next) => {
  const { education } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  for (let i = 0; i < education.length; i++) {
    if (
      typeof education[i] !== "object" ||
      !education[i].collegeName ||
      !education[i].course ||
      !education[i].completedIn ||
      typeof education[i].completedIn !== "number"
    ) {
      return next(new ApiError("Invalid Education Credentials", 400));
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      education,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Education Updated Successfully",
    data: updatedUser,
  });
});

// Updating Work Experience
export const updateExperience = asyncHandler(async (req, res, next) => {
  const { experience } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  for (let i = 0; i < experience.length; i++) {
    if (
      typeof experience[i] !== "object" ||
      !experience[i].role ||
      !experience[i].company ||
      !experience[i].startDate ||
      typeof experience[i].isWorking !== "boolean"
    ) {
      return next(new ApiError("Invalid Experience Credentials", 400));
    }

    if (!experience[i].isWorking && !experience[i].endDate) {
      return next(
        new ApiError("Please Provide end date or select working", 400)
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      experience,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Experience Updated Successfully",
    data: updatedUser,
  });
});

// Updating Social Media Links
export const udpateSocialLinks = asyncHandler(async (req, res, next) => {
  const { socialLinks } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  if (!socialLinks) {
    return next(new ApiError("Missing Credentials", 400));
  }

  if (typeof socialLinks !== "object") {
    return next(new ApiError("Invalid Credentials", 400));
  }

  if (
    (socialLinks.github && !URL_REGEX.test(socialLinks.github)) ||
    (socialLinks.linkedin && !URL_REGEX.test(socialLinks.linkedin)) ||
    (socialLinks.twitter && !URL_REGEX.test(socialLinks.twitter)) ||
    (socialLinks.instagram && !URL_REGEX.test(socialLinks.instagram))
  ) {
    return next(new ApiError("All values must be URL", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      socialLinks,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Social Links Updated Successfully",
    data: updatedUser,
  });
});

//Updating Spoken Languages
export const udpateSpokenLanguages = asyncHandler(async (req, res, next) => {
  const { spokenLanguages } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  for (let i = 0; i < spokenLanguages.length; i++) {
    if (typeof spokenLanguages[i] !== "string") {
      return next(new ApiError("Invalid Spoken Languages Credentials"));
    }
    spokenLanguages[i] = spokenLanguages[i].trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      spokenLanguages,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Spoken Languages Updated Successfully",
    data: updatedUser,
  });
});

// Updating Website URL
export const updateWebsite = asyncHandler(async (req, res, next) => {
  const { website } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  if (website && !URL_REGEX.test(website)) {
    return next(new ApiError("Invalid URL", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      website,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Website URL Updated Successfully",
    data: updatedUser,
  });
});

// Updating Resume
export const udpateResume = asyncHandler(async (req, res, next) => {
  const { resume } = req.body;
  const { userId } = req.params;
  const user = req.user;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError("Invalid userID", 400));
  }

  if (userId !== user._id) {
    return next(new ApiError("Can't Change Other's Information", 401));
  }

  if (resume && !URL_REGEX.test(resume)) {
    return next(new ApiError("Invalid Resume URL", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      resume,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new ApiError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Resume Updated Successfully Successfully",
    data: updatedUser,
  });
});
