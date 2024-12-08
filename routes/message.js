import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  gettingMessages,
  updateMessage,
} from "../controllers/message.js";

const router = Router();

//Creating new message
router.post("/", createMessage);

//Getting Message
router.get("/:id", gettingMessages);

//Updating existing message
router.put("/", updateMessage);

//Deleting existing message
router.delete("/", deleteMessage);

export default router;
