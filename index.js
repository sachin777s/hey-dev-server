import express from "express";
import env from "dotenv";
import { dbConfig } from "./db/dbConfig.js";

//env confiuration
env.config();

//Database Configuration
dbConfig();

const app = express();
const PORT = process.env.PORT || 8000;

//Listening port
app.listen(PORT, () => {
  console.log(`Server is running on htttp://localhost:${PORT}`);
});
