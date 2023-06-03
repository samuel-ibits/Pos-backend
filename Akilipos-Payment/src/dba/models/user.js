import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, minlength: 8, trim: true, required: true },
  image: { type: String },
  phone: { type: String, minlength: 10, maxlength: 11 },
  address: { type: String, required: true },
  username: { type: String, required: true, trim: true, unique: true },
  storeId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "business"
  }],
  status: { type: String, default: "inactive" },
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

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
