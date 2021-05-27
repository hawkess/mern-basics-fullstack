import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "./../template";

const app = express();

app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(helmet());

app.get("/", (req, res) => {
  res.status(200).send(Template());
});

export default app;
