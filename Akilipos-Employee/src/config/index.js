import dotenv from "dotenv";
dotenv.config();

export const configs = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  PRODUCT_SERVICE: "product_service",
  ORDER_SERVICE: "order_service",
  NOTIFICATION_SERVICE: "notification_service",
  CUSTOMER_SERVICE: "customer_service",
};
