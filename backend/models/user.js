const mongoose = require('mongoose');
const { emailRegex } = require('../utils/validator');
const crypto = require("crypto");
const { type } = require('os');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [emailRegex, "Please enter valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "superadmin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationTokenHash: String,
    verificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    bio: {
      type: String,
      default: "",
    },

    // ✅ multi avatar support
    avatars: [
      {
        type: String,
        default:
          "https://res.cloudinary.com/du30lufrc/image/upload/v1757866114/default_profile_pic_hozygj.jpg",
      },
    ],
    activeAvatar: {
      type: String,
      default:
        "https://res.cloudinary.com/du30lufrc/image/upload/v1757866114/default_profile_pic_hozygj.jpg",
    },

    banner: {
      type: String,
      default:
        "https://res.cloudinary.com/du30lufrc/image/upload/v1758014784/downloadable_banner_gennsk.png",
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [{ type: String }],
    social: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    anonymousMode: {
      type: Boolean,
      default: false,
    },
    privateProfile: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationTokenHash = crypto.createHash("sha256").update(token).digest("hex");
  this.verificationExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;