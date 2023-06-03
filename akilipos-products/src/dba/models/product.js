import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const productSchema = mongoose.Schema(
  {
    // the owner field contains the id of the user who created the item
    owner: {
      type: ObjectID,
      required: true,
      ref: "business",
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
    productLocation: {
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
    minimiumQuantity: { type: Number, default: 1 },
    imageUrl: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model("Product", productSchema);
