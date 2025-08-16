const mongoose = require('mongoose');
const {emailRegex} = require('../utils/validator');

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
      minlength: [8, "Password Must be atleast 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
        type: String,
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User',userSchema);
module.exports = User;