import EmployeeRepository from "../dba/repository/employeeRepository.js";
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
    this.employeeRepository = new EmployeeRepository();
  }

  // Registering Employee Services
  async SignUp({
    email,
    password,
    address,
    phone,
    username,
    name,
    businessId,
    salary,
    position
  }) {
    try {
      // checking if Employee already exists
      const existingEmployee = await this.employeeRepository.FindExistingEmployee(
        email,
        "email"
      );
      if (existingEmployee) {
        throw new BadRequestError("Account with this email already exists");
      }
      // const checkPasswordMatch = await CheckPassword(password, confirmPassword);
      if (!existingEmployee) {
        if (password) {
          const salt = 12;
          const hashedPassword = await HashPassword(password, salt);
          const verification_code = await CreateVerificationString();
          const createEmployee = await this.employeeRepository.CreateEmployee({
            email,
            phone,
            name,
            username,
            address,
            password: hashedPassword,
            businessId,
            salary,
            position
          });
          const token = await GenerateSignature({
            email: email,
            _id: createEmployee._id,
          });

          return FormatData({
            id: createEmployee._id,
            email: createEmployee.email,
            businessId: createEmployee.businessId,
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
  async Login(employeeInputs) {
    const { email, password } = employeeInputs;
    try {
      const existingEmployee = await this.employeeRepository.FindExistingEmployee(
        email,
        "email"
      );

      if (existingEmployee) {
        const isValidPassword = await ValidatePassword(
          password,
          existingEmployee.password,
          existingEmployee.salt
        );
        if (isValidPassword) {
          const token = await GenerateSignature({
            email: existingEmployee.email,
            _id: existingEmployee.id,
          });
          return FormatData({ id: existingEmployee._id, token });
        } else {
          throw new ValidationError("invalid credentials", true);
        }
      } else {
        throw new BadRequestError("Employee with the email does not exist", true);
      }
    } catch (e) {
      throw new APIError(
        e.name ? e.name : "Data Not Found",
        e.statusCode ? e.statusCode : STATUS_CODES.INTERNAL_ERROR,
        e.message
      );
    }
  }

  // Get Employee
  async GetProfile(id) {
    try {
      const profile = await this.employeeRepository.GetEmployeeProfile(id);

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

  // Delete Employee
  async DeleteEmployee(id) {
    try {
      const profile = await this.employeeRepository.DeleteEmployeeProfile(id);
      return FormatData({
        profile,
        msg: "Employee deleted"
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Employees
  async GetEveryEmployees() {
    try {
      const employees = await this.employeeRepository.GetAllEmployees();

      return FormatData({
        employees,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Employees in a Store
  async GetEveryEmployeesofaStore(id) {
    try {
      const employees = await this.employeeRepository.GetEmployeesOfAStore(id);

      return FormatData({
        employees,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // edit employee profile
  async UpdateEmployeeProfile(employeeInputs) {
    const { name, phone, address, state, gender, birthday, userId } =
      employeeInputs;

    try {
      const updatedProfile = await this.employeeRepository.UpdateEmployeeProfile({
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
