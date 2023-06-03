import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { cartModel } from "../models/cart.js";
// import { productModel } from "../models/product.js";
import { messageModel } from "../models/message.js";
// Database operations

class MessageRepository {
  async CreateMessage({ business, sender, subject, body, mobileNumbers }) {
    try {
      const newMessage = await messageModel.create({
        business,
        sender,
        subject,
        body,
        mobileNumbers,
      });
      console.log(newMessage, "new message");
      const saveMessage = await newMessage.save();
      console.log(saveMessage, "showing saved product");
      return saveMessage;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to create Product ${err.message}`
      );
    }
  }
  // get a Message
  async GetMessage({ messageId }) {
    try {
      const message = await productModel.findById({ _id: messageId });
      console.log(message, "from message model");
      return message;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }

  // get all Messages
  async GetAllMessages() {
    try {
      const allMessages = await messageModel.find({});
      return allMessages;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get all products ${err.message}`
      );
    }
  }

  // get business Message
  async GetBusinessMessage(businessId) {
    try {
      const businesssMessage = await cartModel.findOne({
        business: businessId,
      });
      console.log("business model found", businesssMessage);
      return businesssMessage;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

export default MessageRepository;
