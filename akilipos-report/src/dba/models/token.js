import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  resetPasswordToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export const TokenModel = mongoose.model("token", tokenSchema);
