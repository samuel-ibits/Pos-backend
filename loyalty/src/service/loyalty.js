import LevelRepository from "../dba/repository/levelRepo";
import PointRepository from "../dba/repository/pointRepo";

import {
  APIError,
  BadRequestError,
  STATUS_CODES,
  ValidationError,
} from "../utils/app-errors.js";

export default class LoyaltyService {
  constructor() {
    // this.productRepository = new ProductRepository();
    this.pointRepository = new PointRepository();
    this.levelRepository = new LevelRepository();
  }

  // get all points
  async GetPoints() {
    try {
      const points = await this.pointRepository.GetAllPoints();
      return points;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get all levels
  async GetLevels() {
    try {
      const levels = await this.levelRepository.GetAllLevel();
      return levels;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get user point
  async GetUserPoints({ userId }) {
    try {
      const userPoints = await this.pointRepository.GetUserPoint({ userId });
      return userPoints;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get user level
  async GetUserLevels({ userId }) {
    try {
      const userLevels = await this.levelRepository.GetUserLevel({ userId });
      return userLevels;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // create point
  async CreatePoint({ businessId, userId, coinEarned, coinWorth }) {
    console.log("creating product");
    try {
      const createPoint = await this.pointRepository.CreatePoint({
        businessId,
        userId,
        coinEarned,
        coinWorth,
      });
      console.log(createPoint, "checking create pointt");
      return createPoint;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // create level
  async CreateLevel({ businessId, userId, level }) {
    console.log("creating product");
    try {
      const createLevel = await this.levelRepository.CreateLevel({
        businessId,
        userId,
        level,
      });
      console.log(createLevel, "checking create pointt");
      return createLevel;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // edit points
  async EditPoint({ pointId, coinEarned, coinWorth }) {
    try {
      const existingPoint = await this.pointRepository.GetPoint(pointId);
      if (!existingPoint) {
        throw new BadRequestError("product not found");
      }
      const updatePoint = await this.pointRepository.UpdatePoint({
        pointId,
        coinEarned,
        coinWorth,
      });
      return updatePoint;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Updating a product failed",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // edit levels
  async EditLevel({ levelId, level }) {
    try {
      const existingLevel = await this.levelRepository.GetLevel(levelId);
      if (!existingLevel) {
        throw new BadRequestError("product not found");
      }
      const updateLevel = await this.levelRepository.updateLevel({
        levelId,
        level,
      });
      return updateLevel;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Updating a product failed",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get business level info
  async GetBusinessLevel({ businessId }) {
    try {
      const businessLevels = await this.levelRepository.GetBusinessLevels({
        businessId,
      });
      return businessLevels;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get business points info
  async GetBusinessPoint({ businessId }) {
    try {
      const businessPoints = await this.pointRepository.GetBusinessPoints({
        businessId,
      });
      return businessPoints;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }
}
