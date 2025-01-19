import { Router } from "express";
import {
  follow,
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
router.put("/:userId/experience", updateExperience);
router.put("/:userId/social-links", udpateSocialLinks);
router.put("/:userId/spoken-languages", udpateSpokenLanguages);
router.put("/:userId/website", updateWebsite);
router.put("/:userId/resume", udpateResume);

export default router;
