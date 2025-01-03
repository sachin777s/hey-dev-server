import { Schema, model } from "mongoose";

const tweetSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    media: {
      type: {
        type: String,
        enum: ["image", "video"],
      },
      url: {
        type: String,
      },
    },
    parentTweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      default: null,
    },
    rootTweetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Tweet = model("Tweet", tweetSchema);
export default Tweet;
