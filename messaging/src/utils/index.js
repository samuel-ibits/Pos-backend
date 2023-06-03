import bcrypt from "bcryptjs";
import crypto from "crypto";
import axios from "axios";
import {
  APIError,
  BadRequestError,
  STATUS_CODES,
} from "../utils/app-errors.js";
import jwt from "jsonwebtoken";
import { configs } from "../config/index.js";
const {
  APP_SECRET,
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  NIG_MESSAGE_PASSWORD,
  NIG_MESSAGE_USERNAME,
  FAULT_SERVICE,
  NOTIFICATION_SERVICE,
  CLIENT_SERVICE,
  PRODUCT_SERVICE,
} = configs;
import amqplib from "amqplib";

//Utility functions
export const CreateVerificationString = async () => {
  return crypto.randomBytes(20).toString("hex");
};

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const SendTextMessage = async ({
  textMessage,
  mobiles,
  businessName,
}) => {
  const messenger = await axios
    .get(
      `https://portal.nigeriabulksms.com/api/?username=${NIG_MESSAGE_USERNAME}&password=${NIG_MESSAGE_PASSWORD}&message=${textMessage}&sender=${businessName}&mobiles=${mobiles}`
    )
    .then(function (response) {
      // Handle success
      console.log(response.data, "from response");
      return response.data;
    })
    .catch(function (error) {
      // Handle error
      console.log(error, "from error");
      return error;
    });
  // console.log(messenger, "from messenger");
  return messenger;
};

export const HashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

export const CheckPassword = async (password, confirmPassword) => {
  if (password === confirmPassword) {
    return password === confirmPassword;
  }
};

export const ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

export const GenerateSignature = async (payload) => {
  return jwt.sign(payload, "secret", { expiresIn: "1d" });
};

export const ValidateSignature = async (req) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  }

  return false;
};

export const FormatData = (data) => {
  console.log("-----here_---", data);
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//Message Broker
export const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

export const SubscribeMessage = async (channel, service) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, PRODUCT_SERVICE);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
