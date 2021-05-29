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
  passwordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Password",
  },
});

export default mongoose.model("User", UserSchema);
