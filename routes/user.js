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
  getUserCommunities,
} from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { requireAuth } from "@clerk/express";

const router = Router();

// Getting single user
router.get(
  "/profile",
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
  "/:userId/communities",
  requireAuth(),
  authMiddleware,
  getUserCommunities
);

/***** Updating user informations *****/
router.put("/", requireAuth(), authMiddleware, updateUser);
router.put(
  "/profile/profile-picture",
  requireAuth(),
  authMiddleware,
  updateProfilePicture
);
router.put("/:userId/skills", requireAuth(), authMiddleware, updateSkills);
router.put("/:userId/projects", requireAuth(), authMiddleware, updateProjects);
router.put(
  "/:userId/education",
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
  "/:userId/spoken-languages",
  requireAuth(),
  authMiddleware,
  udpateSpokenLanguages
);
router.put("/:userId/website", requireAuth(), authMiddleware, updateWebsite);
router.put("/:userId/resume", requireAuth(), authMiddleware, udpateResume);

export default router;
