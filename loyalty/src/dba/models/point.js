import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const pointSchema = mongoose.Schema(
  {
    // the owner field contains the id of the user who created the item
    bussinessId: {
      type: ObjectID,
      required: true,
      ref: "Business",
    },
    userId: {
      type: ObjectID,
      required: true,
      ref: "customer",
    },
    coinEarned: {
      type: Number,
      required: true,
    },
    coinWorth: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const pointModel = mongoose.model("Point", pointSchema);
