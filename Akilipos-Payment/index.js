import express from "express";
import { expressApp } from "./express-app.js";
import { connect_db } from "./src/dba/connection.js";
import dotenv from "dotenv";
import { CreateChannel } from "./src/utils/index.js";
dotenv.config();

const StartServer = async () => {
  const PORT = process.env.PORT || 4400;
  const app = express();

  await connect_db();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log("Error occurred");
      process.exit();
    });
};

StartServer();
