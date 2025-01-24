import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  gettingMessages,
  updateMessage,
} from "../controllers/message.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

//Creating new message
router.post("/", authMiddleware, createMessage);

//Getting Message
router.get("/", authMiddleware, gettingMessages);

//Updating existing message
router.put("/:messageId", authMiddleware, updateMessage);

//Deleting existing message
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;
