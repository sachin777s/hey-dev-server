import { Schema, model } from "mongoose";

const communitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
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
      maxlength: 500,
      minLength: 50,
    },
    logo: {
      type: String,
      default: null,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rules: [
      {
        type: String,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Community = model("Community", communitySchema);

export default Community;
