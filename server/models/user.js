import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    validate: [
      (v) => validator.isLength(v, { min: 4, max: 24 }),
      "Username must be between 4 and 24 characters",
    ],
    required: "A name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "An account with that email already exists",
    validate: [(v) => validator.isEmail(v), "Invalid email address"],
    required: "An email address is required",
  },
  timestamps: {
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
  },
  hashed_password: {
    type: String,
    required: "A password is required",
  },
  salt: String,
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  auth: function (plaintext) {
    return this.encryptPassword(plaintext) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) throw new Error("No password provided for encryption.");
    try {
      bcrypt.hash(password, salt).then((hash) => hash);
    } catch (err) {
      console.log("Failed to encrypt password: ", err);
      return "";
    }
  },
  makeSalt: async function () {
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw new Error("No salt generated.");
    return salt;
  },
};

export default mongoose.model("User", UserSchema);
