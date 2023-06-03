import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, minlength: 8, trim: true, required: true },
  logo: { type: String },
  phone: { type: String, minlength: 10, maxlength: 11 },
  address: { type: String, required: true },
  userName: { type: String, required: true, trim: true, unique: true },
  role: { type: String, default: "user" },
  country: { type: String },
  status: { type: String, default: "inactive" },

}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.updatedAt;
      delete ret.__v;
    },
  },
  timestamps: true,
}
);

const BusinessModel = mongoose.model("business", BusinessSchema);
export default BusinessModel;
