import UserRepository from "../dba/repository/userRepository.js";
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
import { configs } from "../config/index.js";

// const { SITE_DOMAIN } = configs;

// Auth Services logic
export default class AuthController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // Registering User Services
  async SignUp({
    email,
    password,
    address,
    phone,
    businessName,
    userName,
    salt,
    verificationString,
  }) {
    try {
      // checking if user already exists
      const existingUser = await this.userRepository.FindExistingUser(
        email,
        "email"
      );
      if (existingUser) {
        throw new BadRequestError("User already exists");
      }
      //       const checkPasswordMatch = await CheckPassword(password, confirmPassword);
      if (!existingUser) {
        if (password) {
          const salt = await GenerateSalt();
          const hashedPassword = await HashPassword(password, salt);
          const verification_code = await CreateVerificationString();
          const createUser = await this.userRepository.CreateUser({
            email,
            phone,
            address,
            businessName,
            userName,
            password: hashedPassword,
            //             salt,
            //             verificationString,
          });
          const token = await GenerateSignature({
            email: email,
            _id: createUser._id,
          });

          return FormatData({
            id: createUser._id,
            email: createUser.email,
            token,
          });
        } else {
          throw new BadRequestError("password must be thesame", true);
        }
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // update logo
  async UpdateLogo({ logo, businessId }) {
    try {
      const updateLogo = await this.userRepository.UpdateLogo({
        logo,
        businessId,
      });
      console.log(updateLogo, "update logo");
      return updateLogo;
    } catch (e) {
      throw new APIError(
        e.name ? e.name : "Data Not Found",
        e.statusCode ? e.statusCode : STATUS_CODES.INTERNAL_ERROR,
        e.message
      );
    }
  }

  // SignIn Service
  async Login(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingUser = await this.userRepository.FindExistingUser(
        email,
        "email"
      );

      if (existingUser) {
        const isValidPassword = await ValidatePassword(
          password,
          existingUser.password,
          existingUser.salt
        );
        if (isValidPassword) {
          const token = await GenerateSignature({
            email: existingUser.email,
            _id: existingUser.id,
          });
          return FormatData({ id: existingUser._id, token });
        } else {
          throw new ValidationError("invalid credentials", true);
        }
      } else {
        throw new BadRequestError("user with the email does not exist", true);
      }
    } catch (e) {
      throw new APIError(
        e.name ? e.name : "Data Not Found",
        e.statusCode ? e.statusCode : STATUS_CODES.INTERNAL_ERROR,
        e.message
      );
    }
  }

  // Register Vendor
  async VendorSignUp({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    address,
    zone,
    city,
    state,
  }) {
    try {
      // checking if vendor already exists
      const existingVendor = await this.userRepository.FindExistingVendor(
        email,
        "email"
      );
      const checkPasswordMatch = await CheckPassword(password, confirmPassword);
      if (!existingVendor) {
        if (checkPasswordMatch) {
          let salt = await GenerateSalt();
          let hashPassword = await HashPassword(password, salt);
          let verificationString = await CreateVerificationString();

          const createVendor = await this.userRepository.CreateVendor({
            name: `${lastName} ${firstName}`,
            email,
            password: hashPassword,
            phone,
            address,
            city,
            state,
            salt,
            zone,
            // verificationString,
          });
          const token = await GenerateSignature({
            email: email,
            _id: createVendor._id,
          });
          return FormatData({
            id: createVendor._id,
            email: createVendor.email,
            token,
            link,
          });
        } else {
          throw new BadRequestError("passwords does not match", true);
        }
      } else {
        throw new BadRequestError("user with this email already exist", true);
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // SignIn Vendor
  async VendorLogin(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingVendor = await this.userRepository.FindExistingVendor(
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
        throw new BadRequestError("user with the email does not exist", true);
      }
    } catch (e) {
      throw new APIError(
        e.name ? e.name : "Data Not Found",
        e.statusCode ? e.statusCode : STATUS_CODES.INTERNAL_ERROR,
        e.message
      );
    }
  }
  // Get User
  async GetProfile({ id }) {
    try {
      const profile = await this.userRepository.GetUserProfile({
        id,
      });

      return FormatData({
        profile,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async GetAllBusiness() {
    try {
      const profile = await this.userRepository.GetAllUsers();

      return FormatData({
        profile,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get Vendor
  async GetVendorProfile({ id }) {
    try {
      const vendorProfile = await this.userRepository.GetVendorProfile({
        id,
      });

      return FormatData({
        vendorProfile,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // edit business profile
  async UpdateBusiness(userInputs) {
    const {
      businessId,
      password,
      phone,
      address,
      coinValue,
      coinName,
      userName,
    } = userInputs;

    try {
      let salt = await GenerateSalt();
      let hashPassword = await HashPassword(password, salt);
      const updatedProfile = await this.userRepository.UpdateBusiness({
        businessId,
        password: hashPassword,
        phone,
        address,
        coinValue,
        coinName,
        userName,
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

  // edit user profile
  async UpdateVendorProfile(userInputs) {
    const {
      name,
      email,
      phone,
      address,
      state,
      gender,
      birthday,
      userId,
      nin,
      bvn,
      zone,
    } = userInputs;

    try {
      const updatedProfile = await this.userRepository.UpdateVendorProfile({
        name,
        email,
        phone,
        address,
        gender,
        birthday,
        state,
        userId,
        nin,
        bvn,
        zone,
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
