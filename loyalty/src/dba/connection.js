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
  } catch (e) {
    console.log("🚀 ~ file: db_connection.js ~ line 12 ~ connect ~ e", e);
  }
};
