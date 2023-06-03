import mongoose from "mongoose";

const vendorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthday: { type: String },
    gender: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    zone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    bvn: { type: String },
    nin: { type: String },
    document: { type: String },
  },
  {
    // toJSON: {
    //   transform(doc, ret) {
    //     delete ret.password;
    //     delete ret.salt;
    //     delete ret.__v;
    //   },
    // },
    timestamps: true,
  }
);

export const vendorModel = mongoose.model("vendor", vendorSchema);
