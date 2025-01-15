import { Schema } from "mongoose";

export const experienceSchema = new Schema(
  {
    role: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    isWorking: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
    },
  },
  { _id: false }
);
