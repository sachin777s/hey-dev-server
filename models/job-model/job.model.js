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
    },
    location: {
      type: "String",
      required: function () {
        return this.locationType !== "Remote";
      },
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
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
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Deadline must be a future date",
      },
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
