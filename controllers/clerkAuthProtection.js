import asyncHandler from "../utils/asyncHandler.js";

export const clerkAuthProtection = asyncHandler(async (req,res,next) => {
  res.status(401).json({
    success: false,
    message: "Your are not authenticated",
  });
});
