import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, minlength: 10, maxlength: 11 },
  address: { type: String, required: true },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "businesses"
  },
  status: { type: String, default: "inactive" }

}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.updatedAt;
      delete ret.__v;
    },
  },
  timestamps: true,
}
);

const VendorModel = mongoose.model("vendors", VendorSchema);
export default VendorModel;
