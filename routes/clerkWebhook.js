import bodyParser from "body-parser";
import { Router } from "express";
import { clerkRegisterWebhook } from "../controllers/clerkWebhook.js";

const router = Router();

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  clerkRegisterWebhook
);

export default router;