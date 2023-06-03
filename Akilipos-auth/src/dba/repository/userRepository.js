import crypto from "crypto";

import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { TokenModel } from "../models/token.js";
import BusinessModel from "../models/user.js";
import { vendorModel } from "../models/vendor.js";
// Database operations
class UserRepository {
  async CreateUser({
    email,
    phone,
    password,
    businessName,
    userName,
    address,
  }) {
    try {
      const newUser = await BusinessModel.create({
        email,
        phone,
        password,
        address,
        businessName,
        userName,
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

  async UpdateLogo({ logo, businessId }) {
    try {
      const filter = { _id: businessId };
      const update = {
        logo: logo,
      };
      const profile = await BusinessModel.updateOne(filter, update, {
        new: true,
      });

      return profile;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${err.message}`
      );
    }
  }

  async UpdateBusiness({
    businessId,
    password,
    phone,
    address,
    coinValue,
    coinName,
    userName,
  }) {
    try {
      const filter = { _id: businessId };
      const update = {
        password,
        phone,
        address,
        coinValue,
        coinName,
        userName,
      };
      const profile = await BusinessModel.findByIdAndUpdate(filter, update, {
        new: true,
      });

      return profile;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${err.message}`
      );
    }
  }


  async CreateVendor({
    name,
    email,
    password,
    phone,
    zone,
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
        zone,
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
    birthday,
    gender,
    email,
    phone,
    address,
    bvn,
    zone,
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
        gender,
        birthday,
        bvn,
        nin,
        zone,
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
      //   const user = await BusinessModel.findOne({ token });
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

  async GetUserProfile({ id }) {
    try {
      const profile = await BusinessModel.findById({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetAllUsers() {
    try {
      const profile = await BusinessModel.find();
      return profile;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetVendorProfile({ id }) {
    try {
      const vendorProfile = await vendorModel.findById({ _id: id });
      return vendorProfile;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateUserProfile({
    businessId,
    password,
    phone,
    address,
    coinValue,
    coinName,
    salt,
  }) {
    try {
      const filter = { _id: businessId };
      const update = {
        password,
        phone,
        address,
        coinValue,
        coinName,
        salt,
      };
      const profile = await BusinessModel.findByIdAndUpdate(filter, update, {
        new: true,
      });

      return profile;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${err.message}`
      );
    }
  }

  async FindExistingUser(query, queryType) {
    try {
      let existinguser;
      if (queryType === "id")
        existinguser = await BusinessModel.findOne({ _id: query });
      else if (queryType === "email")
        existinguser = await BusinessModel.findOne({ email: query });
      else if (queryType === "verification_code")
        existinguser = await BusinessModel.findOne({
          verificationString: query,
        });
      return existinguser;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong ${error.message}`
      );
    }
  }

  async FindExistingVendor(query, queryType) {
    try {
      let existingVendor;
      if (queryType === "id")
        existingVendor = await vendorModel.findOne({ _id: query });
      else if (queryType === "email")
        existingVendor = await vendorModel.findOne({ email: query });
      else if (queryType === "verification_code")
        existingVendor = await vendorModel.findOne({
          verificationString: query,
        });
      return existingVendor;
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
