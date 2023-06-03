import MessageRepository from "../dba/repository/messageRepository.js";
// import ProductRepository from "../dba/repository/productRepository.js";

import {
  APIError,
  BadRequestError,
  STATUS_CODES,
  ValidationError,
} from "../utils/app-errors.js";

export default class MessageService {
  constructor() {
    // this.productRepository = new ProductRepository();
    this.messageRepository = new MessageRepository();
  }

  // get all messages
  async GetMessages() {
    try {
      const messages = await this.messageRepository.GetAllMessages();
      return messages;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Message not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get single Message
  async GetAMessage({ messageId }) {
    try {
      const message = await this.messageRepository.GetMessage({ messageId });
      return message;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Message not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async CreateMessage({ business, sender, subject, body, mobileNumbers }) {
    console.log("creating message");
    try {
      const createMessage = await this.messageRepository.CreateMessage({
        business,
        sender,
        subject,
        body,
        mobileNumbers,
      });
      console.log(createMessage, "checking create message");
      return createMessage;
    } catch (err) {
      console.log(err.message, "from error message");
      // return err.message;
      throw new APIError(
        err.name ? err.name : "Message Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async GetBusinessMessage(businessId) {
    try {
      const businessMessage = await this.messageRepository.GetBusinessMessage(
        businessId
      );
      if (businessMessage && businessMessage.items.length > 0) {
        return businessMessage;
      } else {
        const returnMsg = "No message found for business";
        console.log("business message empty");
        // return returnMsg;
        throw new APIError(returnMsg);
      }
    } catch (err) {
      throw new APIError(
        err.message ? err.message : "get business message error",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
      // console.log(err);
    }
  }
}
