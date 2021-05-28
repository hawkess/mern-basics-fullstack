import User from "../models/user";
import extend from "lodash/extend";
import { getErrMessage } from "./../helpers/dbErrorHandler";

// Helper to remove hashed password from stored user data before response to client
const stripHash = (u) => {
  const {
    name,
    email,
    timestamps: { created, updated },
  } = u;
  return {
    name: name,
    email: email,
    timestamps: { created: created, updated: updated },
  };
};

const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({ message: "Account successfully created" });
  } catch (err) {
    return res.status(500).json({ error: getErrMessage(err) });
  }
};

const read = (req, res) => {
  return res.json(stripHash(req.profile));
};

const update = async (req, res, next) => {
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.timestamp.updated = Date.now();
    await user.save();
    res.json(stripHash(user));
  } catch (err) {
    return res.status(500).json({ error: getErrMessage(err) });
  }
};

const remove = (req, res, next) => {
  try {
    let user = req.profile;
    let deleted = await user.remove();
    res.json(stripHash(deleted));
  } catch (err) {
    return res.status(500).json({ error: getErrMessage });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find({}).select("name email timestamps");
    res.json(users);
  } catch (err) {
    return res.status(500).json({
      error: getErrMessage(err),
    });
  }
};

const userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ error: "Specified user not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Could not retrieve specified user",
    });
  }
};

export default { create, read, update, remove, list, userById };
