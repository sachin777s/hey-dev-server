import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user-model/user.model.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // Clerk userId

    // Use Clerk's JavaScript Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId);

    const userMongooseDocument = await User.findOne({ clerkId: user.id });

    req.user = userMongooseDocument;
    next();
  } catch (error) {
    return next(new ApiError("Something went wrong", 401));
  }
};

export default authMiddleware;
