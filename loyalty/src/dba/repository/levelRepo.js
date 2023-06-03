import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { levelModel } from "../models/level.js";

// Database operations

class LevelRepository {
  async CreateLevel({ businessId, userId, level }) {
    try {
      const newLevel = new levelModel({ businessId, userId, level });
      const saveLevel = await newLevel.save();
      return saveLevel;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to create Product ${err.message}`
      );
    }
  }

  // get user levels
  async GetUserLevel({ userId }) {
    try {
      const userLevel = await levelModel.findOne({ userId: userId });
      return userLevel;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }

  // get level
  async GetLevel({ id }) {
    try {
      const level = await levelModel.findById({ _id: id });
      return level;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }

  // get business levels
  async GetBusinessLevels({ businessId }) {
    try {
      const businessLevels = await levelModel.findOne({
        businessId: businessId,
      });
      return businessLevels;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }
  // get all levels
  async GetAllLevel() {
    try {
      const allLevel = await levelModel.find({});
      return allLevel;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get all products ${err.message}`
      );
    }
  }

  // update level
  async updateLevel({ levelId, level }) {
    try {
      const filterLevel = { _id: levelId };
      const levelUpdate = {
        level,
      };
      const updatedLevel = productModel.findByIdAndUpdate(
        filterLevel,
        levelUpdate,
        { new: true }
      );
      return updatedLevel;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `can't update product ${err.message}`
      );
    }
  }
}

export default LevelRepository;
