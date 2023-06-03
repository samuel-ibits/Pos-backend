import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { TokenModel } from "../models/token.js";
import EmployeeModel from "../models/employee.js";
import BusinessModel from "../models/business.js";

// Database operations
class EmployeeRepository {
  async CreateEmployee({
    email,
    phone,
    password,
    name,
    username,
    address,
    businessId,
    salary,
    position
  }) {
    try {
      const newEmployee = await EmployeeModel.create({
        email,
        phone,
        password,
        address,
        name,
        username,
        businessId,
        salary,
        position
      });
      const saveEmployee = await newEmployee.save();
      return saveEmployee;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create Employee ${error.message}`
      );
    }
  };

  // async UpdateEmployeeProfile({
  //   userId,
  //   email,
  //   phone,
  //   password,
  //   name,
  //   username,
  //   address,
  // }) {
  //   try {
  //     const employeeProfile = await EmployeeModel.findByIdAndUpdate(userId, {
  //       email,
  //       phone,
  //       password,
  //       name,
  //       username,
  //       address,
  //     });
  //     return employeeProfile;
  //   } catch (error) {
  //     throw new APIError(
  //       "API Error",
  //       STATUS_CODES.INTERNAL_ERROR,
  //       `unable to update Employee: ${error}`
  //     );
  //   }
  // };

  async VerifyEmail({ token }) {
    try {
      const employee = this.FindExistingEmployee(token, "verification_code");
      employee.verified = true;
      // employee.emailStatus = "verified";
      // employee.verificationString = undefined;
      await employee.save();
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `error from verifyEmail ${error.message}`
      );
    }
  };

  async GetEmployeeProfile(id) {
    try {
      const profile = await EmployeeModel.findById({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error from GetEmployeeProfile", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async DeleteEmployeeProfile(id) {
    try {
      const profile = await EmployeeModel.findByIdAndRemove({ _id: id });
      return profile;
    } catch (err) {
      throw new APIError("API Error from DeleteEmployeeProfile", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async GetAllEmployees() {
    try {
      const employees = await EmployeeModel.find()
        .populate("storeId", "businessName address")
      return employees;
    } catch (err) {
      throw new APIError("API Error from GetAllEmployees", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async GetEmployeesOfAStore(id) {
    try {
      const employees = await EmployeeModel.find({ businessId: id });
      return employees;
    } catch (err) {
      throw new APIError("API Error from GetEmployeesOfAStore", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  };

  async UpdateEmployeeProfile({
    userId,
    email,
    phone,
    password,
    name,
    username,
    address,
    businessId
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
        businessId
      };
      const profile = await EmployeeModel.findByIdAndUpdate(filter, update, {
        // new: true,
        returnOriginal: false
      });

      return profile;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Update employee ${err.message}`
      );
    }
  };

  async FindExistingEmployee(query, queryType) {
    try {
      let existingEmployee;
      if (queryType === "id")
        existingEmployee = await EmployeeModel.findOne({ _id: query });
      else if (queryType === "email")
        existingEmployee = await EmployeeModel.findOne({ email: query });
      else if (queryType === "verification_code")
        existingEmployee = await EmployeeModel.findOne({
          verificationString: query,
        });
      return existingEmployee;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `something went wrong finding existing Employee ${error.message}`
      );
    }
  };

  async CreateToken(employee) {
    try {
      let token = await new TokenModel({
        userId: employee.id,
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
export default EmployeeRepository;