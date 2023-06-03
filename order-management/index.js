import express from "express";
import { expressApp } from "./express-app.js";
import { connect_db } from "./src/dba/connection.js";
import dotenv from "dotenv";
import { CreateChannel } from "./src/utils/index.js";
import { AkiliChannelQue } from "./src/utils/messaging-que.js";

// const { PORT } = import "./config.js
dotenv.config();

const StartServer = async () => {
  const PORT = "8002";
  const app = express();

  await connect_db();

  // const channel = await CreateChannel();
  const channel = await AkiliChannelQue();

  await expressApp(app, channel);

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();
