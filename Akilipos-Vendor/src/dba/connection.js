import mongoose from "mongoose";
import { configs } from "../config/index.js";

export const connect_db = async () => {
  const { DB_URL } = configs;

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("database ready to go");
  } catch (err) {
    console.log("error connecting to database");
    console.log(err);
  }
};



