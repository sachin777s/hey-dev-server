import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: function () {
        return !this.image;
      },
    },
    image: {
      type: String,
      required: function () {
        return !this.text;
      },
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

export default Message;
