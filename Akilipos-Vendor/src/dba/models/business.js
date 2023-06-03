import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
  businessName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, minlength: 8, trim: true, required: true },
  logo: { type: String },
  phone: { type: String, minlength: 10, maxlength: 11 },
  address: { type: String, required: true },
  userName: { type: String, required: true, trim: true },
  role: { type: String, default: "user" },
  country: { type: String },
  status: { type: String, default: "inactive" },

}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret.password;
      delete ret.updatedAt;
      delete ret.__v;
    },
  },
  timestamps: true,
}
);

const BusinessModel = mongoose.model("businesses", BusinessSchema);
export default BusinessModel;
