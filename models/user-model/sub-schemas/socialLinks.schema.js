import { Schema } from "mongoose";
import { URL_REGEX, VALIDATION_MESSAGES } from "../user.constants.js";

export const socialLinksSchema = new Schema(
  {
    github: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
    linkedin: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
    twitter: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
    instagram: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
  },
  { _id: false }
);
