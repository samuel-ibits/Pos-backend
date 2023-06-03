import mongoose from "mongoose";
const ObjectID = mongoose.Schema.Types.ObjectId;
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: ObjectID,
      ref: "users",
      // required: true,
    },
    employee: {
      type: ObjectID,
      ref: "employees",
      // required: true,
    },
    business: {
      type: ObjectID,
      ref: "businesses",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    orderType: {
      type: String,
      enum: ["cart", "order"],
      default: "cart",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "refund"],
      default: "pending",
    },
    totalBill: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// const Order = mongoose.model('Order', orderSchema);
export const orderModel = mongoose.model("Order", orderSchema);
// module.exports = Order;
