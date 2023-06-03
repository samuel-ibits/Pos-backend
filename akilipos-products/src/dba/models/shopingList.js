import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const shopListSchema = new mongoose.Schema(
  {
    business: {
      type: ObjectID,
      required: true,
      ref: "businesses",
    },
    products: [
      {
        productId: {
          type: ObjectID,
          ref: "Product",
          required: true,
        },
        name: String,
        imageUrl: {
          type: Array,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 5,
          default: 1,
        },
        sellingPrice: Number,
        costPrice: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pedning", "purchase", "received"],
    },
  },
  {
    timestamps: true,
  }
);

export const shopListModel = mongoose.model("ShopList", shopListSchema);
