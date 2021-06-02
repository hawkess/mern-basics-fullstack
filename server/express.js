import Template from "./../template";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import devpack from "./devpack"; // TODO: comment out for production

import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";

const CWD = process.cwd();

const app = express();

devpack.compile(app); // TODO: comment out for production

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(helmet());
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/dist", express.static(path.join(CWD, "dist")));

app.get("/", (req, res) => {
  res.status(200).send(Template());
});

app.use((err, req, res, next) => {
  if (err) {
    const status = err.name === "UnauthorizedError" ? 401 : 400;
    const message = { error: `${err.name}: ${err.message}` };
    res.status(status).json(message);
    status !== 401 && console.log(message);
    return;
  }
  next();
});

export default app;
