import { Schema, model } from "mongoose";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    logo: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    foundedIn: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    industry: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      minlength: [10, "Invalid Mobile Number"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    employeeCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Organization = model("Organization", organizationSchema);

export default Organization;
