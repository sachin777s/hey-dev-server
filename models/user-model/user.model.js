import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { socialLinksSchema } from "./sub-schemas/socialLinks.schema.js";
import { projectSchema } from "./sub-schemas/project.schema.js";
import { educationSchema } from "./sub-schemas/education.schema.js";
import {
  URL_REGEX,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  VALIDATION_MESSAGES,
} from "./user.constants.js";
import { experienceSchema } from "./sub-schemas/experience.schema.js";

// Main User schema
const userSchema = new Schema(
  {
    clerkId: {
      type: String,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      maxlength: [40, "Full name cannot exceed 40 characters"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      match: [USERNAME_REGEX, ""],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, VALIDATION_MESSAGES.EMAIL],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [40, "Password cannot exceed 40 characters"],
      match: [PASSWORD_REGEX, VALIDATION_MESSAGES.PASSWORD],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      maxlength: [100, "Bio cannot exceed 100 characters"],
      default: "",
    },
    about: {
      type: String,
      maxlength: [500, "About cannot exceed 500 characters"],
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    resume: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    spokenLanguages: {
      type: [String],
      default: [],
    },
    website: {
      type: String,
      default: "",
      match: [URL_REGEX, VALIDATION_MESSAGES.URL],
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = model("User", userSchema);
export default User;
