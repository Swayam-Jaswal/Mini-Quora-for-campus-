const crypto = require("crypto");
const AdminCode = require("../models/adminCode");
const ModeratorCode = require("../models/moderatorCode");
const User = require("../models/user");

// --- Dashboard Models ---
const Question = require("../models/question");
const Answer = require("../models/answer");
const Request = require("../models/request");
const Announcement = require("../models/announcements");

// === Codes ===

// ✅ Superadmin: generate Admin code
const generateAdminCode = async (req, res) => {
  try {
    const code = crypto.randomBytes(6).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newCode = new AdminCode({ code, expiresAt });
    await newCode.save();

    return res.status(200).json({
      message: "Admin code generated successfully",
      code,
      expiresAt,
      expiresInMinutes: 15,
      _id: newCode._id,
      role: "admin",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate Admin Code", error });
  }
};

// ✅ Admin + Superadmin: generate Moderator code
const generateModeratorCode = async (req, res) => {
  try {
    const code = crypto.randomBytes(6).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newCode = new ModeratorCode({ code, expiresAt });
    await newCode.save();

    return res.status(200).json({
      message: "Moderator code generated successfully",
      code,
      expiresAt,
      expiresInMinutes: 15,
      _id: newCode._id,
      role: "moderator",
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate Moderator Code", error });
  }
};

// === Role Management ===

// Promote to moderator
const promoteToModerator = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (["moderator", "admin", "superadmin"].includes(user.role)) {
      return res.status(400).json({ message: "User already has elevated role" });
    }

    user.role = "moderator";
    await user.save();

    return res.status(200).json({ message: "User promoted to moderator", user });
  } catch (error) {
    return res.status(500).json({ message: "Error promoting user", error });
  }
};

// Promote to admin
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ message: "Already an admin" });
    }
    if (user.role === "superadmin") {
      return res.status(400).json({ message: "Superadmin cannot be changed" });
    }

    user.role = "admin";
    await user.save();

    return res.status(200).json({ message: "User promoted to admin", user });
  } catch (error) {
    return res.status(500).json({ message: "Error promoting user to admin", error });
  }
};

// Demote moderator → user
const demoteToUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (["superadmin", "admin"].includes(user.role)) {
      return res.status(403).json({ message: "Admins and superadmins cannot be demoted here" });
    }

    if (user.role !== "moderator") {
      return res.status(400).json({ message: "Only moderators can be demoted" });
    }

    user.role = "user";
    await user.save();

    return res.status(200).json({ message: "User demoted to user", user });
  } catch (error) {
    return res.status(500).json({ message: "Error demoting user", error });
  }
};

// Demote admin → user
const demoteAdminToUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") {
      return res.status(400).json({ message: "Only admins can be demoted" });
    }

    user.role = "user";
    await user.save();

    return res.status(200).json({ message: "Admin demoted to user", user });
  } catch (error) {
    return res.status(500).json({ message: "Error demoting admin", error });
  }
};

// === Codes ===
const getCodes = async (req, res) => {
  try {
    const now = new Date();
    const adminCodes = await AdminCode.find({ expiresAt: { $gt: now } }).lean();
    const moderatorCodes = await ModeratorCode.find({ expiresAt: { $gt: now } }).lean();

    const combined = [
      ...adminCodes.map((c) => ({ ...c, role: "admin" })),
      ...moderatorCodes.map((c) => ({ ...c, role: "moderator" })),
    ];

    return res.status(200).json(combined);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch codes", error });
  }
};

const deleteCode = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = await AdminCode.findByIdAndDelete(id);
    if (!deleted) {
      deleted = await ModeratorCode.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ message: "Code not found" });
    }

    return res.status(200).json({ message: "Code deleted successfully", id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete code", error });
  }
};

// === Dashboard ===
const getStats = async (req, res) => {
  try {
    const [users, questions, answers, announcements, pendingRequests] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments(),
      Answer.countDocuments(),
      Announcement.countDocuments(),
      Request.countDocuments({ status: "pending" }),
    ]);

    return res.status(200).json({
      users,
      questions,
      answers,
      announcements,
      pendingRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch stats", error: error?.message || error });
  }
};

const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password -verificationTokenHash -verificationExpires"),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error?.message || error });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User id required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot delete superadmin" });
    }

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted", id });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user", error: error?.message || error });
  }
};

module.exports = {
  generateAdminCode,
  generateModeratorCode,
  promoteToModerator,
  promoteToAdmin,
  demoteToUser,
  demoteAdminToUser,
  getCodes,
  deleteCode,
  getStats,
  getUsers,
  deleteUserById,
};
