import ClientRepository from "../dba/repository/clientRepository.js";
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
const { SITE_DOMAIN } = configs;

// All Business logic will be here
class ClientService {
  constructor() {
    this.repository = new ClientRepository();
  }

  async SignUp({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    address,
    city,
    state,
    zipCode,
  }) {
    try {
      //check if user is already registered
      const existingClient = await this.repository.FindExistingClient(
        email,
        "email"
      );

      const passwordMatch = await CheckPassword(password, confirmPassword);

      if (!existingClient) {
        if (passwordMatch) {
          let salt = await GenerateSalt();

          let hashedPassword = await HashPassword(password, salt);
          let verificationString = await CreateVerificationString();

          const createdClient = await this.repository.CreateClient({
            name: `${lastName} ${firstName}`,
            email,
            password: hashedPassword,
            phone,
            address,
            city,
            state,
            zipCode,
            salt,
            verificationString,
          });

          const token = await GenerateSignature({
            email: email,
            _id: createdClient._id,
          });

          const link = `${SITE_DOMAIN}/verifyemail/?token=${createdClient.verificationString}`;

          return FormatData({
            id: createdClient._id,
            email: createdClient.email,
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

  async SendEmailVerifcation({ id }) {
    try {
      const existingClient = await this.repository.FindExistingClient(id, "id");

      const link = `${SITE_DOMAIN}/verifyemail/?token=${existingClient.verificationString}`;

      return FormatData({ email: existingClient.email, link });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async VerifyEmail({ token }) {
    try {
      const tokenExist = await this.repository.FindExistingClient(
        token,
        "verification_code"
      );
      if (tokenExist) {
        await this.VerifyEmail(token);
      } else {
        throw new BadRequestError("invalid token", true);
      }

      return FormatData({ email: token.email });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingClient = await this.repository.FindExistingClient(
        email,
        "email"
      );

      if (existingClient) {
        const validPassword = await ValidatePassword(
          password,
          existingClient.password,
          existingClient.salt
        );

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingClient.email,
            _id: existingClient._id,
          });
          return FormatData({ id: existingClient._id, token });
        } else {
          throw new ValidationError("invalid credentials", true);
        }
      } else {
        throw new BadRequestError("user with the email does not exist", true);
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async UpdateClientProfile(userInputs) {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      userId,
    } = userInputs;

    try {
      const updatedProfile = await this.repository.UpdateClientProfile({
        name: `${lastName} ${firstName}`,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
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
  async ForgotPassword(userInputs) {
    const { email } = userInputs;

    try {
      const existingClient = await this.repository.FindExistingClient(
        email,
        "email"
      );

      if (existingClient) {
        const token = await this.repository.FindTokenByUserId({
          user: existingClient,
        });

        const link = `${SITE_DOMAIN}/passwordreset/?token=${token.resetPasswordToken}&id=${existingClient._id}&email=${email}`;

        const data = { link, email };

        return FormatData({
          message: `a link has been sent to your email -${email}`,
          data,
        });
      } else {
        throw new BadRequestError("user with the email does not exist", true);
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async GetProfile({ id }) {
    try {
      const profile = await this.repository.GetClientProfile({
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

  async GetAllClients({ id }) {
    try {
      const clients = await this.repository.GetClients();
      return FormatData({
        clients,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async CheckResetLink({ tokenstring }) {
    try {
      const token = await this.repository.FindTokenByUserTokenString({
        tokenstring,
      });

      if (token) {
        return FormatData({
          message: `valid`,
        });
      } else {
        throw new BadRequestError("link expired or invalid", true);
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async ResetPassword({ id, password, confirmPassword }) {
    try {
      const existingClient = await this.repository.FindExistingClient(id, "id");
      const passwordMatch = await CheckPassword(password, confirmPassword);

      if (existingClient) {
        if (passwordMatch) {
          let hashedPassword = await GeneratePassword(
            password,
            existingClient.salt
          );

          await this.repository.UpdatePassword({
            id,
            password: hashedPassword,
          });

          return FormatData({
            message: "password changed successfully",
          });
        } else {
          throw new APIError(
            "API Error",
            STATUS_CODES.BAD_REQUEST,
            "password does not match"
          );
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

  async SubscribeEvents(payload) {
    const { event, data } = payload;

    const { order } = data;

    switch (event) {
      case "CREATE_ORDER":
        this.ManageOrder(userId, order);
        break;

      default:
        break;
    }
  }
}

export default ClientService;
