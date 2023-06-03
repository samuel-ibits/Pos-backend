import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const levelSchema = mongoose.Schema(
  {
    businessId: {
      type: ObjectID,
      required: true,
      ref: "Business",
    },
    userId: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    level: {
      type: String,
      required: true,
      enum: ["Silver", "Super User"],
    },
  },
  {
    timestamps: true,
  }
);

export const levelModel = mongoose.model("Level", levelSchema);
