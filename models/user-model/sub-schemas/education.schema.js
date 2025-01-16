import { Schema } from "mongoose";

export const educationSchema = new Schema(
  {
    collegeName: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    completedIn: {
      type: Number,
      min: 1900,
    },
  },
  { _id: false }
);
