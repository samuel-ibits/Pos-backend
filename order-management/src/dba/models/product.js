import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const productSchema = mongoose.Schema(
  {
    // the owner field contains the id of the user who created the item
    owner: {
      type: ObjectID,
      required: true,
      ref: "businesses",
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
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    coinValue: {
      type: Number,
    },
    quantity: { type: Number, required: true },
    imageUrl: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model("products", productSchema);
