import { URL_REGEX } from "./organization.constants";

export const socialLinksSchema = new Schema(
  {
    github: {
      type: String,
      default: "",
      match: [URL_REGEX, "Invalid URL"],
    },
    linkedin: {
      type: String,
      default: "",
      match: [URL_REGEX, "Invalid URL"],
    },
    twitter: {
      type: String,
      default: "",
      match: [URL_REGEX, "Invalid URL"],
    },
    instagram: {
      type: String,
      default: "",
      match: [URL_REGEX, "Invalid URL"],
    },
  },
  { _id: false }
);
