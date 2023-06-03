import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { pointModel } from "../models/point.js";
// import { levelModel } from "../models/level.js";

// Database operations

class PointRepository {
  async CreatePoint({ businessId, userId, coinEarned, coinWorth }) {
    try {
      const newPoint = new levelModel({
        businessId,
        userId,
        coinEarned,
        coinWorth,
      });
      const savePoint = await newPoint.save();
      return savePoint;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to create Product ${err.message}`
      );
    }
  }

  // get point
  async GetPoint({ id }) {
    try {
      const getPoint = await pointModel.findById({ _id: id });
      return getPoint;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }

  // get user points
  async GetUserPoint({ userId }) {
    try {
      const userPoint = await pointModel.findOne({ userId: userId });
      return userPoint;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }

  // get business points
  async GetBusinessPoints({ businessId }) {
    try {
      const businessPoints = await pointModel.findOne({
        businessId: businessId,
      });
      return businessPoints;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }
  // get all levels
  async GetAllPoints() {
    try {
      const allPoints = await pointModel.find({});
      return allPoints;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get all products ${err.message}`
      );
    }
  }

  // update point
  async UpdatePoint({ pointId, coinEarned, coinWorth }) {
    try {
      const filterLevel = { _id: pointId };
      const pointUpdate = {
        coinEarned,
        coinWorth,
      };
      const updatedPoint = productModel.findByIdAndUpdate(
        filterLevel,
        pointUpdate,
        { new: true }
      );
      return updatedPoint;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `can't update product ${err.message}`
      );
    }
  }
}

export default PointRepository;
