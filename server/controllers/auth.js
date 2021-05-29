import Password from "../models/password";
import User from "../models/user";

import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "../../config/config";

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password } = await Password.findById(user.passwordId);
    if (!user.auth(password)) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not complete authentication" });
  }
};

const logout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({ message: "Successfully logged out" });
};

const requireAuth = expressJwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuth = (req, res, next) => {
  const isAuth = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!auth)
    return res
      .status(403)
      .json({ error: "You do not have permission to do that" });
};

export default { login, logout, requireAuth, hasAuth };
