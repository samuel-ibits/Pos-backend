import express from "express";
import cors from "cors";
import { auth } from "./src/api/index.js";
import HandleErrors from "./src/utils/error-handler.js";
export const expressApp = async (app, channel) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  //api
  auth(app, channel);

  // error handling
  app.use(HandleErrors);
};
