import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const productSchema = mongoose.Schema(
  {
    // the owner field contains the id of the user who created the item
    owner: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: { type: Number, required: true },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model("Product", productSchema);
