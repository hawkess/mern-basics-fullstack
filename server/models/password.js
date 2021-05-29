import bcrypt, { hash } from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";

const PasswordSchema = new mongoose.Schema({
  password: {
    type: String,
    validate: [
      (v) => validator.isLength(v, { min: 8, max: 24 }),
      "Password must be between 8 and 24 characters",
    ],
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
});

PasswordSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    return bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  }
  next();
});

PasswordSchema.methods = {
  auth: async function (plaintext) {
    try {
      return await bcrypt.compare(plaintext, this.password);
    } catch (err) {
      console.log(err);
    }
  },
};

export default mongoose.model("Password", PasswordSchema);
