import express from "express";
import env from "dotenv";
import { dbConfig } from "./db/dbConfig.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postRoter from "./routes/post.js";
import messageRouter from "./routes/message.js";
import communityRouter from "./routes/community.js";
import companyRouter from "./routes/company.js";
import jobRouter from "./routes/job.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import clerkRouter from "./routes/clerkWebhook.js";
import { clerkMiddleware } from "@clerk/express";
import authProtection from "./routes/clerkAuthProtection.js";
import { Server } from "socket.io";

//env confiuration
env.config();

//Database Configuration
dbConfig();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "*", credentials: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk middleware
app.use(clerkMiddleware());

// Clerk authenticate protection
app.use("/api/auth-protection", authProtection);

// Clerk webhook for register and update user
app.use("/api/webhook", clerkRouter);

//Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRoter);
app.use("/api/message", messageRouter);
app.use("/api/community", communityRouter);
app.use("/api/company", companyRouter);
app.use("/api/job", jobRouter);

//Error Handler
app.use(errorMiddleware);

//Listening port
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  maxHttpBufferSize: 10 * 1024 * 1024, // 10 MB
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("New Connection");
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log(userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.reciever);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit("msg-recieve", data);
    }
  });

  // Handle typing event
  socket.on("typing", ({ sender, receiver }) => {
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      socket.to(receiverSocket).emit("user-typing", sender);
    }
  });

  socket.on("stop-typing", ({ sender, receiver }) => {
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      socket.to(receiverSocket).emit("user-stopped-typing", sender);
    }
  });
});
