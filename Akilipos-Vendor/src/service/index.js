import VendorRepository from "../dba/repository/vendorRepository.js";
import {
  FormatData,
  CheckPassword,
  HashPassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  CreateVerificationString,
} from "../utils/index.js";
import {
  APIError,
  BadRequestError,
  STATUS_CODES,
  ValidationError,
} from "../utils/app-errors.js";

// Auth Services logic
export default class AuthController {

  constructor() {
    this.vendorRepository = new VendorRepository();
  }

  // Registering Vendor Services
  async SignUp({
    address,
    phone,
    name,
    businessId
  }) {
    try {
      // checking if Vendor already exists
      const existingVendorName = await this.vendorRepository.FindExistingVendor(
        name,
        "name"
      );
      const existingVendorAddress = await this.vendorRepository.FindExistingVendor(
        address,
        "address"
      );
      if (existingVendorName && existingVendorAddress) {
        throw new BadRequestError("Vendor with this name and address already exists");
      }
      if (!existingVendorName || !existingVendorAddress) {
        const createVendor = await this.vendorRepository.CreateVendor({
          phone,
          name,
          address,
          businessId
        });


        return FormatData({
          id: createVendor._id,
          name: createVendor.name,
          address: createVendor.address,
        });
        // if (password) {
        //   const createVendor = await this.vendorRepository.CreateVendor({
        //     phone,
        //     name,
        //     address,
        //     businessId
        //   });


        //   return FormatData({
        //     id: createVendor._id,
        //     email: createVendor.email,
        //   });
        // } else {
        //   throw new BadRequestError("password must be the same", true);
        // }
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // SignIn Service
  async Login(vendorInputs) {
    const { email, password } = vendorInputs;
    try {
      const existingVendor = await this.vendorRepository.FindExistingVendor(
        email,
        "email"
      );

      if (existingVendor) {
        const isValidPassword = await ValidatePassword(
          password,
          existingVendor.password,
          existingVendor.salt
        );
        if (isValidPassword) {
          const token = await GenerateSignature({
            email: existingVendor.email,
            _id: existingVendor.id,
          });
          return FormatData({ id: existingVendor._id, token });
        } else {
          throw new ValidationError("invalid credentials", true);
        }
      } else {
        throw new BadRequestError("Vendor with the email does not exist", true);
      }
    } catch (e) {
      throw new APIError(
        e.name ? e.name : "Data Not Found",
        e.statusCode ? e.statusCode : STATUS_CODES.INTERNAL_ERROR,
        e.message
      );
    }
  }

  // Get Vendor
  async GetProfile(id) {
    try {
      const profile = await this.vendorRepository.GetVendorProfile(id);

      return FormatData({
        profile
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Delete Vendor
  async DeleteVendor(id) {
    try {
      const profile = await this.vendorRepository.DeleteVendorProfile(id);
      return FormatData({
        profile,
        msg: "Vendor deleted"
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Vendors
  async GetEveryVendors() {
    try {
      const vendors = await this.vendorRepository.GetAllVendors();

      return FormatData({
        vendors,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Vendors in a Store
  async GetEveryVendorsofaStore(id) {
    try {
      const vendors = await this.vendorRepository.GetVendorsOfAStore(id);

      return FormatData({
        vendors,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // edit Vendor profile
  async UpdateVendorProfile(id, vendorInputs) {
    const { name, phone, address } =
      vendorInputs;

    try {
      const updatedProfile = await this.vendorRepository.UpdateVendorProfile(id, {
        name,
        phone,
        address
      });

      return FormatData({ updatedProfile, message: "update successful" });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

}
