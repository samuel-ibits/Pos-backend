import express from "express";
import cors from "cors";
import HandleErrors from "./src/utils/error-handler.js";
import { product } from "./src/api/index.js";
import path from "path";
export const expressApp = async (app, channel) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  //api
  // client(app, channel);
  product(app, channel);

  // error handling
  app.use(HandleErrors);
};
