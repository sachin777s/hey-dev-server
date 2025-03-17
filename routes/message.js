import { Router } from "express";
import {
  clearChat,
  createMessage,
  deleteMessage,
  gettingMessages,
  messageUsers,
  updateMessage,
} from "../controllers/message.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Creating new message
router.post("/", authMiddleware, createMessage);

// Getting Message
router.get("/:messageUserId", authMiddleware, gettingMessages);

// Updating existing message
router.put("/:messageId", authMiddleware, updateMessage);

// Deleting existing message
router.delete("/:messageId", authMiddleware, deleteMessage);

// Clear chat with an specific user
router.delete("/chat/clear/:recieverId", authMiddleware, clearChat);

// Getting messaged user
router.get("/users/messaged", authMiddleware, messageUsers);
export default router;
