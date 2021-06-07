import auth from "../controllers/auth";
import config from "../../config/config";
import Password from "../models/password";
import Token from "../models/token";
import User from "../models/user";

import express from "express";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const login = async (req, res) => {
  let response;
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const password = await Password.findById(user.passwordId);
    if (!password)
      return res.status(500).json({ error: "Something went wrong " });
    if (!password.auth(req.body.password))
      return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: `${config.jwtExpiry}m`,
    });
    const token_expiry = new Date(
      new Date().getTime() + config.jwtExpiry * 60 * 1000
    );

    response = { token, token_expiry };
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Could not complete authentication: " + err });
  }

  const refreshToken = uuidv4();
  const newRefresh = {
    user_id: user._id,
    token: refreshToken,
    expires: new Date(new Date().getTime + config.refresnExpiry * 60 * 1000),
  };

  try {
    newRefresh.save();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not generate refresh token: " + err });
  }

  res.cookie("refresh_token", refreshToken, {
    maxAge: options.refresnExpiry * 60 * 1000,
    httpOnly: true,
    secure: false,
  });

  response = {
    ...response,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  };

  return res.json(response);
};

const logout = (req, res) => {
  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Successfully logged out" });
};

const requireAuth = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuth = (req, res, next) => {
  const isAuth = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!isAuth)
    return res
      .status(403)
      .json({ error: "You do not have permission to do that" });
  next();
};

const refresh = async (req, res) => {
  let response;

  const refresh_token = req.cookies("refresh_token");
  try {
    const { user_id, token } = await Token.findOne({ refresh_token });

    if (token.length === 0)
      return res.status(401).json({ error: "Invalid refresh token" });
    await Token.deleteOne({ user_id: user_id });
    const newRefreshToken = uuidv4();

    const newRefresh = {
      user_id: user._id,
      token: newRefreshToken,
      expires: new Date(new Date().getTime + config.refresnExpiry * 60 * 1000),
    };

    try {
      newRefresh.save();
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Could not generate refresh token: " + err });
    }

    res.cookie("refresh_token", refreshToken, {
      maxAge: options.refresnExpiry * 60 * 1000,
      httpOnly: true,
      secure: false,
    });

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(404).json({ error: "User not found" });
    } catch (err) {
      res.status(401).json({ error: "Could not find user" });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: `${config.jwtExpiry}m`,
    });
    const token_expiry = new Date(
      new Date().getTime() + config.jwtExpiry * 60 * 1000
    );

    response = {
      token,
      token_expiry,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token request" });
  }

  return res.json(response);
};

export default { login, logout, requireAuth, hasAuth, refresh };
