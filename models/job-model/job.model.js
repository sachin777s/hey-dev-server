import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      max: 2000,
    },
    skills: [
      {
        type: String,
      },
    ],
    experienceInYear: {
      type: Number,
      required: true,
      min: 0,
    },
    salary: {
      minRange: Number,
      maxRange: Number,
    },
    locationType: {
      type: String,
      enum: ["Office", "Remote", "Hybrid"],
      required: true,
    },
    location: {
      type: "String",
      required: function () {
        return this.locationType !== "Remote";
      },
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    applicants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    openings: {
      type: Number,
      min: 1,
    },
    deadline: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Job = model("Job", jobSchema);

export default Job;
