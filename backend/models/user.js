const mongoose = require('mongoose');
const { emailRegex } = require('../utils/validator');
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [emailRegex, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["user","moderator" ,"admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationTokenHash: String,
    verificationExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  this.verificationExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
