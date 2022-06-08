const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    password: { type: String, required: true },
    gender: { type: String, required: false },
    status: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
    image: { type: String, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
