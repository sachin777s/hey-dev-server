import { Router } from "express";
import {
  followUnfollow,
  getFollowers,
  getFollowings,
  getUser,
  udpateEducation,
  udpateResume,
  udpateSocialLinks,
  udpateSpokenLanguages,
  updateExperience,
  updateProfilePicture,
  updateProjects,
  updateSkills,
  updateUser,
  updateWebsite,
} from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Getting single user
router.get("/:userId", authMiddleware, getUser);

//Searching Users
router.get("/search");

// Following another user
router.put("/following", authMiddleware, followUnfollow);

// Getting user's followers
router.get("/followers/get", authMiddleware, getFollowers);

// Getting user's followings
router.get("/followings/get", authMiddleware, getFollowings);

/***** Updating user informations *****/
router.put("/", authMiddleware, updateUser);
router.put("/:userId/profile-picture", authMiddleware, updateProfilePicture);
router.put("/:userId/skills", authMiddleware, updateSkills);
router.put("/:userId/projects", authMiddleware, updateProjects);
router.put("/:userId/education", authMiddleware, udpateEducation);
router.put("/:userId/experience", authMiddleware, updateExperience);
router.put("/:userId/social-links", authMiddleware, udpateSocialLinks);
router.put("/:userId/spoken-languages", authMiddleware, udpateSpokenLanguages);
router.put("/:userId/website", authMiddleware, updateWebsite);
router.put("/:userId/resume", authMiddleware, udpateResume);

export default router;
