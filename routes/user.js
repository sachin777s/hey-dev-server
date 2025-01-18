import { Router } from "express";
import {
  follow,
  getFollowers,
  getFollowings,
  getUser,
  udpateEducation,
  updateProfilePicture,
  updateProjects,
  updateSkills,
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
router.put("/:userId/skills", updateSkills);
router.put("/:userId/projects", updateProjects);
router.put("/:userId/education", udpateEducation);
export default router;
