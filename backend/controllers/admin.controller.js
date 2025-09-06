const crypto = require("crypto");
const AdminCode = require("../models/adminCode");
const ModeratorCode = require("../models/moderatorCode");
const User = require("../models/User");

// --- Added models for dashboard ---
const Question = require("../models/question");
const Answer = require("../models/answer");
const Request = require("../models/request");
const Announcement = require("../models/announcements");

// === EXISTING FUNCTIONALITIES (kept intact) ===

// Generate Admin Code (15 min expiry)
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

// Generate Moderator Code (15 min expiry)
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

// Promote user to moderator (by userId)
const promoteToModerator = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "moderator") {
      return res.status(400).json({ message: "User is already a moderator" });
    }

    user.role = "moderator";
    await user.save();

    return res.status(200).json({ message: "User promoted to moderator", user });
  } catch (error) {
    return res.status(500).json({ message: "Error promoting user", error });
  }
};

// Get valid codes (combined array with role info)
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

// Delete code by ID
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

// === NEW DASHBOARD FUNCTIONS (added) ===

// Stats for dashboard
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

// Paginated user list (admin only)
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

// Delete user by ID (admin only)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User id required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete another admin" });
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
  getCodes,
  deleteCode,
  getStats,
  getUsers,
  deleteUserById,
};
