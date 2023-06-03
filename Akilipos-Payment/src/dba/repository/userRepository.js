import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { TokenModel } from "../models/token.js";
import UserModel from "../models/user.js";
import BusinessModel from "../models/business.js";

// Database operations
class UserRepository {
  async CreateUser({
    email,
    phone,
    password,
    name,
    username,
    address,
    storeId
  }) {
    try {
      const newUser = await UserModel.create({
        email,
        phone,
        password,
        address,
        name,
        username,
        storeId
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
  };

  // async UpdateCustomerProfile({
  //   userId,
  //   email,
  //   phone,
  //   password,
  //   name,
  //   username,
  //   address,
  // }) {
  //   try {
  //     const userProfile = await UserModel.findByIdAndUpdate(userId, {
  //       email,
  //       phone,
  //       password,
  //       name,
  //       username,
  //       address,
  //     });
  //     return userProfile;
  //   } catch (error) {
  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       `unable to update user: ${error}`
  //     );
  //   }
  // };

  async VerifyEmail({ token }) {
    try {
      const user = this.FindExistingUser(token, "verification_code");
      user.verified = true;
      // user.emailStatus = "verified";
      // user.verificationString = undefined;
      await user.save();
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `error from verifyEmail ${error.message}`
      );
    }
  };

  async GetCustomerProfile({ id }) {
    try {
      const profile = await UserModel.findById({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error from GetCustomerProfile", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async DeleteCustomerProfile({ id }) {
    try {
      const profile = await UserModel.findByIdAndRemove({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error from DeleteCustomerProfile", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async GetAllCustomers() {
    try {
      const customers = await UserModel.find()
        .populate("storeId", "businessName address")
      return customers;
    } catch (err) {
      throw new APIError("API Error from GetAllCustomers", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async GetCustomersOfAStore({ id }) {
    try {
      const customers = await UserModel.find({ storeId: id });
      return customers;
    } catch (err) {
      throw new APIError("API Error from GetCustomersOfAStore", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async UpdateCustomerProfile({
    userId,
    email,
    phone,
    password,
    name,
    username,
    address,
    storeId
  }) {
    try {
      const filter = { _id: userId };
      const update = {
        email,
        phone,
        password,
        name,
        username,
        address,
        storeId
      };
      const profile = await UserModel.findByIdAndUpdate(filter, update, {
        // new: true,
        returnOriginal: false
      });

      return profile;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Update User ${err.message}`
      );
    }
  };

  async FindExistingUser(query, queryType) {
    try {
      let existinguser;
      if (queryType === "id")
        existinguser = await UserModel.findOne({ _id: query });
      else if (queryType === "email")
        existinguser = await UserModel.findOne({ email: query });
      else if (queryType === "verification_code")
        existinguser = await UserModel.findOne({
          verificationString: query,
        });
      return existinguser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong finding existing user ${error.message}`
      );
    }
  };

  async CreateToken(user) {
    try {
      let token = await new TokenModel({
        userId: user.id,
        resetPasswordToken: crypto.randomBytes(20).toString("hex"),
      }).save();
      return token;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong creating token ${error.message}`
      );
    }
  };
}
export default UserRepository;