import crypto from "crypto";
import {
  APIError,
  BadRequestError,
  STATUS_CODES,
} from "../../utils/app-errors.js";
import { userModel, userModel } from "../models/user.js";
import { TokenModel } from "../models/token.js";
import { requestModel } from "../models/serviceRequest.js";

//Dealing with database operations
class ClientRepository {
  async VerifyEmail({ token }) {
    try {
      const user = this.FindExistingUser(token, "verification_code");

      user.emailStatus = "Verified";
      user.verificationString = undefined;
      await user.save();
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong  ${err.message}`
      );
    }
  }

  async FindExistinguser(query, queryType) {
    try {
      let existinguser;
      if (queryType === "id")
        existinguser = await userModel.findOne({ _id: query });

      if (queryType === "email")
        existinguser = await userModel.findOne({ email: query });

      if (queryType === "verification_code")
        existinguser = await userModel.findOne({
          verificationString: query,
        });

      return existinguser;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong  ${err.message}`
      );
    }
  }

  async UpdatePassword({ id, password }) {
    try {
      let user = await this.FindExistinguser(id, "id");
      user.password = password;
      await user.save();
      return;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong  ${err.message}`
      );
    }
  }

  async CreateUser({ name, email, password, phone, salt, verificationString }) {
    try {
      const user = new userModel({
        name,
        email,
        password,
        phone,
        salt,
        verificationString,
      });
      const userResult = await user.save();
      return userResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${err.message}`
      );
    }
  }

  async UpdateUserProfile({
    userId,
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    salt,
  }) {
    try {
      const filter = { _id: userId };
      const update = {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        salt,
      };
      const profile = userModel.findByIdAndUpdate(filter, update, {
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

  async FindTokenByUserTokenString({ tokenstring }) {
    try {
      let token;
      token = await TokenModel.findOne({ resetPasswordToken: tokenstring });
      return token;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindTokenByUserId({ user }) {
    try {
      let token;
      token = await TokenModel.findOne({ userId: user._Id });

      if (!token) token = this.CreateToken(user);

      return token;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async CreateToken(user) {
    try {
      let token = await new TokenModel({
        userId: user._id,
        resetPasswordToken: crypto.randomBytes(20).toString("hex"),
      }).save();
      return token;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async AddServiceRequest({
    userId,
    technicianName,
    technicianId,
    description,
    schedule,
    requestId,
  }) {
    try {
      let user = await userModel.findOne({ _id: userId });

      const service = {
        technicianName,
        technicianId,
        description,
        schedule,
        requestId,
      };

      const newRequest = new requestModel(service);

      let request = user.serviceRequests;

      //add the requested service to user model
      request.push(newRequest._id);
      user.serviceRequests = request;
      await user.save();
      return newRequest;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetUserProfile({ id }) {
    try {
      const profile = await userModel.findById({ _id: id }).populate({
        path: "serviceRequests",
        model: "request",
        select: { _id: 0 },
      });

      return profile;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async Getusers() {
    try {
      const users = await userModel.find().populate({
        path: "serviceRequests",
        model: "request",
        select: { _id: 0 },
      });

      return users;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

export default ClientRepository;
