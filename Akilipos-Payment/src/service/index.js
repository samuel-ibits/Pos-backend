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

// Auth Services logic
export default class AuthController {

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Registering User Services
  async SignUp({
    email,
    password,
    confirmPassword,
    address,
    phone,
    username,
    name,
    storeId,
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
      const checkPasswordMatch = await CheckPassword(password, confirmPassword);
      console.log(checkPasswordMatch, "checkPasswordMatch");
      if (!existingUser) {
        if (checkPasswordMatch) {
          const salt = 12;
          const hashedPassword = await HashPassword(password, salt);
          const verification_code = await CreateVerificationString();
          console.log(verification_code, "verificationCode");
          const createUser = await this.userRepository.CreateUser({
            email,
            phone,
            name,
            username,
            address,
            password: hashedPassword,
            storeId
            // salt,
            // verificationString,
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
          throw new BadRequestError("password must be the same", true);
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

  // Get User
  async GetProfile({ id }) {
    try {
      const profile = await this.userRepository.GetCustomerProfile({
        id,
      });

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

  // Delete Customer
  async DeleteCustomer({ id }) {
    try {
      const profile = await this.userRepository.DeleteCustomerProfile({
        id,
      });
      return FormatData({
        profile,
        msg: "Customer deleted"
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Customers
  async GetEveryCustomers() {
    try {
      const customers = await this.userRepository.GetAllCustomers();

      return FormatData({
        customers,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Customers in a Store
  async GetEveryCustomersofaStore({ id }) {
    try {
      const customers = await this.userRepository.GetCustomersOfAStore({ id });

      return FormatData({
        customers,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // edit user profile
  async UpdateUserProfile(userInputs) {
    const { name, phone, address, state, gender, birthday, userId } =
      userInputs;

    try {
      const updatedProfile = await this.userRepository.UpdateUserProfile({
        name,
        phone,
        address,
        gender,
        birthday,
        state,
        userId,
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
