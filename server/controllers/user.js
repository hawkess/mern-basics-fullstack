import Password from "../models/password";
import User from "../models/user";
import getErrMessage from "../helpers/dbErrorHandler";

// Helper to remove password id from stored user data before response to client
const stripPasswordId = (u) => {
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
  const password = new Password({ password: req.body.password });
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordId: password._id,
  });

  try {
    await password.save();
    await user.save();
    return res.status(200).json({ message: "Account successfully created" });
  } catch (err) {
    return res.status(500).json({ error: getErrMessage(err) });
  }
};

const read = (req, res) => {
  return res.json(stripPasswordId(req.profile));
};

const update = async (req, res, next) => {
  try {
    const user = req.profile.user;
    const password = req.profile.password;
    user.timestamp.updated = Date.now();
    password.timestamp.updated = Date.now();
    await user.save();
    await password.save();
    res.json(stripPasswordId(user));
    next();
  } catch (err) {
    return res.status(500).json({ error: getErrMessage(err) });
  }
};

const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    let deleted = await user.remove();
    res.json(stripPasswordId(deleted));
    next();
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
    const password = await Password.findById(user.passwordId);
    if (!password)
      return res.status(500).json({ error: "Something went wrong" });
    req.profile = { user: user, password: password };
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Could not retrieve specified user",
    });
  }
};

export default { create, read, update, remove, list, userById };
