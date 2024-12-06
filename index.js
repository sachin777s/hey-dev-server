import express from "express";
import env from "dotenv";

//env confiuration
env.config();

const app = express();
const PORT = process.env.PORT || 8000;

//Listening port
app.listen(PORT, () => {
    console.log(`Server is running on htttp://localhost:${PORT}`)
})