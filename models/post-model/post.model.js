import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heading: {
      type: String,
    },
    text: {
      type: String,
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
    parentPostId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    rootPostId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      default: null,
    },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
export default Post;
