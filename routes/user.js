import { Router } from "express";
import {
  follow,
  getFollowers,
  getFollowings,
  getUser,
  updateUser,
} from "../controllers/user.js";

const router = Router();

// Getting single user
router.get("/:userId", getUser);

//Searching Users
router.get("/search")

// Updating existing user
router.put("/", updateUser);

// Following another user
router.put("/following", follow);

// Getting user's followers
router.get("/followers", getFollowers);

// Getting user's followings
router.get("/followings", getFollowings);

export default router;
