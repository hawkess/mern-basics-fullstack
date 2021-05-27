import config from "./../config/config";
import app from "./express";

import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", () => {
  throw new Error(`Unable to connect to db: ${mongoUri}`);
});

app.listen(config.port, (err) => {
  err && console.log("ERR: ", err);
  console.info(`Server started on port ${config.port}.`);
});
