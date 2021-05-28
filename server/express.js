import Template from "./../template";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(helmet());
app.use("/", userRoutes);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.status(200).send(Template());
});

export default app;
