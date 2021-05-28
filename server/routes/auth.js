import express from "express";
import auth from "./../controllers/auth";

const router = express.Router();

router.route("/auth/singin").post(auth.login);

router.route("/auth/signout").get(auth.logout);

export default router;
