import express from "express";
import cors from "cors";
import { auth } from "./src/api/index.js";
import HandleErrors from "./src/utils/error-handler.js";
import path from "path";
import bodyParser from "body-parser";

export const expressApp = async (app, channel) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  //api
  auth(app, channel);

  // error handling
  app.use(HandleErrors);
};
