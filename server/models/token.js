import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "A user id is required",
  },
  token: {
    type: String,
    required: "A request token is required",
  },
  expires: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Token", TokenSchema);
