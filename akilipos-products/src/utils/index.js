import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
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
  FAULT_SERVICE,
  CLOUD_NAME,
  API_KEY,
  API_SECRET,
  NOTIFICATION_SERVICE,
  CLIENT_SERVICE,
  PRODUCT_SERVICE,
} = configs;
import amqplib from "amqplib";
import multer from "multer";
import cloudinary from "cloudinary";
import { log } from "console";
//Utility functions
export const CreateVerificationString = async () => {
  return crypto.randomBytes(20).toString("hex");
};

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
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

// handing images upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, new Date().getMilliseconds() + file.originalname);
  },
});

export const upload = multer({ storage: storage }).array("imageUrl", 5);
export const uploadTwo = multer({ storage: storage });

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

// cloudinary upload
export const UploadImage = (data) => {
  let mainFolderName = "Chee-Multi-Vendor";
  console.log(data, "from data");
  let filePathOnCloudinary = mainFolderName + "/" + data;
  const uploadCheck = cloudinary.uploader
    .upload(data, {
      folder: "chee-products",
    })
    .then((result) => {
      fs.unlinkSync(data);
      return {
        message: "success",
        url: result.url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(data);
      return { message: "fail" };
    });
  // let latest = fs.createReadStream(file_name).pipe(stream);
  // console.log(latest, "latest upload complete");
  return uploadCheck;
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
