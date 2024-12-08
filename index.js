import express from "express";
import env from "dotenv";
import { dbConfig } from "./db/dbConfig.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import messageRouter from "./routes/message.js";
import communityRouter from "./routes/community.js";

//env confiuration
env.config();

//Database Configuration
dbConfig();

const app = express();
const PORT = process.env.PORT || 8000;

//Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/community", communityRouter);

//Listening port
app.listen(PORT, () => {
  console.log(`Server is running on htttp://localhost:${PORT}`);
});
