import { Schema } from "mongoose";
import { URL_REGEX, VALIDATION_MESSAGES } from "../user.constants.js";

export const projectSchema = new Schema(
  {
    gitUrl: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
    hostUrl: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
  },
  { _id: false }
);
