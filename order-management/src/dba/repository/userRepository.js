import crypto from "crypto";

import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { TokenModel } from "../models/token.js";
import { userModel } from "../models/user.js";
import { vendorModel } from "../models/vendor.js";
// Database operations
class UserRepository {
  async CreateUser({ name, email, phone, password }) {
    try {
      const newUser = await userModel.create({
        name,
        email,
        phone,
        password,
        // salt,
      });
      const saveUser = await newUser.save();
      return saveUser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${error.message}`
      );
    }
  }
  async CreateVendor({
    name,
    email,
    password,
    phone,
    salt,
    verificationString,
  }) {
    try {
      const newVendor = await vendorModel.create({
        name,
        email,
        password,
        phone,
        salt,
        verificationString,
      });
      const saveVendor = await newVendor.save();
      return saveVendor;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create Vendor ${error.message}`
      );
    }
  }
  async UpdateVendorProfile({
    userId,
    name,
    email,
    phone,
    address,
    nin,
    state,
    salt,
  }) {
    try {
      const vendorProfile = await vendorModel.findByIdAndUpdate(userId, {
        name,
        email,
        phone,
        address,
        nin,
        state,
        salt,
      });
      return vendorProfile;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `unable to create vendor: ${error}`
      );
    }
  }
  async VerifyEmail({ token }) {
    try {
      //   const user = await userModel.findOne({ token });
      //   if (!user) {
      //     throw new BadRequestError("Invalid Token");
      //   }
      //   return user;
      const user = this.FindExistingUser(token, "verification_code");
      user.emailStatus = "verified";
      user.verificationString = undefined;
      await user.save();
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong ${error.message}`
      );
    }
  }
  async FindExistingUser(query, queryType) {
    try {
      let existinguser;
      if (queryType === "id")
        existinguser = await userModel.findOne({ _id: query });
      else if (queryType === "email")
        existinguser = await userModel.findOne({ email: query });
      else if (queryType === "verification_code")
        existinguser = await userModel.findOne({ verificationString: query });
      return existinguser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong ${error.message}`
      );
    }
  }
  async CreateToken(user) {
    try {
      // const token = crypto.encrypt(user.email, user.salt);
      // return token;
      let token = await new TokenModel({
        userId: user.id,
        resetPasswordToken: crypto.randomBytes(20).toString("hex"),
      }).save();
      return token;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong ${error.message}`
      );
    }
  }
}
export default UserRepository;
