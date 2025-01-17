import { Router } from "express";
import {
  follow,
  getFollowers,
  getFollowings,
  getUser,
  updateProfilePicture,
  updateUser,
} from "../controllers/user.js";

const router = Router();

// Getting single user
router.get("/:userId", getUser);

//Searching Users
router.get("/search");

// Following another user
router.put("/following", follow);

// Getting user's followers
router.get("/followers", getFollowers);

// Getting user's followings
router.get("/followings", getFollowings);

/***** Updating user informations *****/
router.put("/", updateUser);

router.put("/:userId/profile-picture", updateProfilePicture);

export default router;
