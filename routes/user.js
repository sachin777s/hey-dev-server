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
  updateWebsite,
  getUserCommunities,
  updateAboutInformation,
} from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const router = Router();

// Getting single user
router.get(
  "/profile/:username",
  requireAuth({ signInUrl: "/api/auth-protection" }),
  authMiddleware,
  getUser
);

//Searching Users
router.get("/search");

// Following another user
router.put("/following", requireAuth(), authMiddleware, followUnfollow);

// Getting user's followers
router.get("/followers/get", requireAuth(), authMiddleware, getFollowers);

// Getting user's followings
router.get("/followings/get", requireAuth(), authMiddleware, getFollowings);

// Getting user's comunities
router.get(
  "/profile/communities",
  requireAuth(),
  authMiddleware,
  getUserCommunities
);

/***** Updating user informations *****/
router.put("/profile/about-information", requireAuth(), authMiddleware, updateAboutInformation);
router.put(
  "/profile/profile-picture",
  requireAuth(),
  authMiddleware,
  updateProfilePicture
);
router.put("/profile/skills", requireAuth(), authMiddleware, updateSkills);
router.put("/profile/projects", requireAuth(), authMiddleware, updateProjects);
router.put(
  "/profile/education",
  requireAuth(),
  authMiddleware,
  udpateEducation
);
router.put(
  "/:userId/experience",
  requireAuth(),
  authMiddleware,
  updateExperience
);
router.put(
  "/:userId/social-links",
  requireAuth(),
  authMiddleware,
  udpateSocialLinks
);
router.put(
  "/profile/spoken-languages",
  requireAuth(),
  authMiddleware,
  udpateSpokenLanguages
);
router.put("/profile/website", requireAuth(), authMiddleware, updateWebsite);
router.put("/profile/resume", requireAuth(), authMiddleware, udpateResume);

export default router;
