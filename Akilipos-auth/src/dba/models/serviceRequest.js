import mongoose from "mongoose";

const requestSchema = mongoose.Schema(
  {
    requestId: String,
    faultDescription: { text: String, imageUrl: String },
    schedule: { type: String },
    technician: { name: String, id: String, email: String, phone: String },
    client: {
      id: String,
      name: String,
      email: String,
      phone: String,
      category: String,
    },
    requestLocation: {
      latitude: String,
      longitude: String,
      text: String,
    },
    serviceType: { type: String, enum: ["Standard", "Premium"] },
    billing: {
      amount: Number,
      status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending",
      },
    },
    requestStatus: {
      type: String,
      enum: ["Pending", "Active", "Closed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const requestModel = mongoose.model("request", requestSchema);
