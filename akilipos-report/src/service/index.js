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
    name,
    email,
    password,
    confirmPassword,
    phone,
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
      const checkPasswordMatch = await CheckPassword(password, confirmPassword);
      if (!existingUser) {
        if (checkPasswordMatch) {
          const salt = await GenerateSalt();
          const hashedPassword = await HashPassword(password, salt);
          const verification_code = await CreateVerificationString();
          const createUser = await this.userRepository.CreateUser({
            name,
            email,
            phone,
            password: hashedPassword,
            salt,
            verificationString,
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
}
