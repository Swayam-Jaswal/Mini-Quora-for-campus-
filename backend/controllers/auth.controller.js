const User = require('../models/User');
const AdminCode = require('../models/adminCode');
const ModeratorCode = require('../models/moderatorCode');
const {emailRegex,passwordRegex} = require('../utils/validator');
const {sendVerificationEmail} = require("../utils/sendEmail");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const { json } = require('stream/consumers');
require('dotenv').config();

const signup = async (req, res) => {
  try {
    const { name, email, password, adminCode, moderatorCode } = req.body;
    const emailCheck = await User.findOne({ email });
    
    if (adminCode && moderatorCode) {
      return res.status(400).json({ message: "Provide only one code: either admin or moderator" });
    }

    if (emailCheck) {
      return res.status(409).json({ message: "email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let role = "user";

    if (adminCode) {
      const foundCode = await AdminCode.findOne({ code: adminCode });
      if (!foundCode || foundCode.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired admin token" });
      }
      role = "admin";
      await AdminCode.deleteOne({ _id: foundCode._id });
    }

    if (moderatorCode) {
      const foundCode = await ModeratorCode.findOne({ code: moderatorCode });
      if (!foundCode || foundCode.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired moderator token" });
      }
      role = "moderator";
      await ModeratorCode.deleteOne({ _id: foundCode._id });
    }

    const newUser = new User({ name, email, password: hashedPassword, role, isVerified: false });

    const verificationToken = newUser.createVerificationToken();
    await newUser.save();

    const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail(email, verificationLink);
    } catch (error) {
      return res.status(500).json({ message: "Failed to send verification email", error });
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "error registering user", error });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Verification token missing" });

    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      verificationTokenHash: hash,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    user.isVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const token = user.createVerificationToken();
    await user.save();

    const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${token}`;
    await sendVerificationEmail(user.email, verificationLink);

    return res.status(200).json({ message: "Verification link resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't resend email verification link" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({ message: "Email not verified. Verify your email to proceed" });
    }

    const passwordCheck = await bcrypt.compare(password, existingUser.password);
    if (!passwordCheck) {
      return res.status(400).json({ message: "invalid password" });
    }

    const tokenData = {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "logged in successfully",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "error logging in", error });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      email: user.email,
      isVerified: Boolean(user.isVerified),
      name: user.name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {signup,verifyEmail,resendVerificationEmail,login,me,logout};