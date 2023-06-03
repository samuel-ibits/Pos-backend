import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const messageSchema = new mongoose.Schema(
  {
    business: {
      type: ObjectID,
      ref: "businesses",
    },
    sender: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    mobileNumbers: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const messageModel = mongoose.model("Message", messageSchema);
