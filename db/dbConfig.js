import mongoose from "mongoose";

export const dbConfig = () => {
  const url = process.env.MONGODB_URL;
  mongoose
    .connect(url)
    .then(() => {
      console.log("Dababase Connected Successfully...");
    })
    .catch((error) => {
      console.log(error);
    });
};
