import mongoose from "mongoose";

const EmplyeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, minlength: 8, trim: true, required: true },
  image: { type: String, default: "https://image.pngaaa.com/553/2189553-middle.png" },
  phone: { type: String, minlength: 10, maxlength: 11 },
  address: { type: String, required: true },
  username: { type: String, required: true, trim: true, unique: true },
  salary: { type: Number, required: true, trim: true },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "businesses"
  },
  status: { type: String, default: "inactive" },
  type: { type: String, default: "employee" },
  position: { type: String },
  verified: { type: Boolean, default: false },

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

const EmployeeModel = mongoose.model("employees", EmplyeeSchema);
export default EmployeeModel;
