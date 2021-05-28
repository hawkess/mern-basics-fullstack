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

UserSchema.path("hashed_password").validate(function (v) {
  if (
    this._password &&
    (this._password.length < 6 || this._password.length > 30)
  ) {
    this.invalidate("password", "Password must be between 6 and 30 characters");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "A password is required");
  }
});

UserSchema.methods = {
  auth: function (plaintext) {
    bcrypt
      .compare(plaintext, this.hashed_password)
      .then((res) => res)
      .catch((err) => console.log(err.message));
  },
  encryptPassword: function (password) {
    if (!password) throw new Error("No password provided for encryption");
    try {
      bcrypt.hash(password, 10).then((hash) => hash);
    } catch (err) {
      throw new Error("Failed to encrypt password: ", err);
    }
  },
};

export default mongoose.model("User", UserSchema);
