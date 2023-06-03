import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { TokenModel } from "../models/token.js";
import VendorModel from "../models/vendor.js";
import BusinessModel from "../models/business.js";

// Database operations
class VendorRepository {
  async CreateVendor({
    phone,
    name,
    address,
    businessId
  }) {
    try {
      const newVendor = await VendorModel.create({
        phone,
        name,
        address,
        businessId
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
  };

  // async UpdateVendorProfile({
  //   userId,
  //   email,
  //   phone,
  //   password,
  //   name,
  //   username,
  //   address,
  // }) {
  //   try {
  //     const vendorProfile = await VendorModel.findByIdAndUpdate(userId, {
  //       email,
  //       phone,
  //       password,
  //       name,
  //       username,
  //       address,
  //     });
  //     return vendorProfile;
  //   } catch (error) {
  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       `unable to update Vendor: ${error}`
  //     );
  //   }
  // };

  async GetVendorProfile(id) {
    try {
      const profile = await VendorModel.findById({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error from GetVendorProfile", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async DeleteVendorProfile(id) {
    try {
      const profile = await VendorModel.findByIdAndRemove({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error from DeleteVendorProfile", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async GetAllVendors() {
    try {
      const vendors = await VendorModel.find()
        .populate("businessId", "businessName address")
      return vendors;
    } catch (err) {
      throw new APIError("API Error from GetAllVendors", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async GetVendorsOfAStore(id) {
    try {
      const vendors = await VendorModel.find({ businessId: id });
      return vendors;
    } catch (err) {
      throw new APIError("API Error from GetVendorsOfAStore", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async UpdateVendorProfile(id, {
    phone,
    name,
    address,
    businessId
  }) {
    try {
      const filter = { _id: id.id };
      const update = {
        phone,
        name,
        address,
        businessId
      };
      const profile = await VendorModel.findByIdAndUpdate(filter, update, {
        // new: true,
        returnOriginal: false
      });

      return profile;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Update vendor ${err.message}`
      );
    }
  };

  async FindExistingVendor(query, queryType) {
    try {
      let existingVendor;
      if (queryType === "id")
        existingVendor = await VendorModel.findOne({ _id: query });
      else if (queryType === "name")
        existingVendor = await VendorModel.findOne({ name: query });
      else if (queryType === "address")
        existingVendor = await VendorModel.findOne({ address: query });
      return existingVendor;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong finding existing Vendor ${error.message}`
      );
    }
  };


}
export default VendorRepository;