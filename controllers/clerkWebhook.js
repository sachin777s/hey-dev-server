import asyncHandler from "../utils/asyncHandler.js";
import { Webhook } from "svix";
import User from "../models/user-model/user.model.js";

//  Clerk Webhook for registering the user
export const clerkRegisterWebhook = async (req, res, next) => {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = JSON.stringify(req.body);

  // Get Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return void res.status(400).json({
      success: false,
      message: "Error: Missing svix headers",
    });
  }

  let evt;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.log("Error: Could not verify webhook:", err.message);
    return void res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  const {
    first_name,
    last_name,
    username,
    profile_image_url,
    email_addresses,
  } = evt.data;

  const userObject = {
    fullName: first_name + " " + last_name,
    username: username,
    email: email_addresses[0].email_address,
    profilePicture: profile_image_url,
  };

  // Creating new user in db
  if (eventType === "user.created") {
    try {
      await User.create({ clerkId: evt.data.id, ...userObject });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  // Updating existing user in db
  if (eventType === "user.updated") {
    try {
      await User.updateOne({ clerkId: evt.data.id }, userObject);

      return res.status(201).json({
        success: true,
        message: "User Updated successfully",
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  return void res.status(200).json({
    success: true,
    message: "Webhook received",
  });
};
