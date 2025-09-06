const crypto = require('crypto');
const AdminCode = require('../models/adminCode');
const ModeratorCode = require('../models/moderatorCode');
const User = require('../models/User');

const generateAdminCode = async (req, res) => {
  try {
    const code = crypto.randomBytes(6).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newCode = new AdminCode({ code, expiresAt });
    await newCode.save();

    return res.status(200).json({
      message: "Admin code generated successfully",
      code,
      expiresAt, 
      expiresInMinutes: 15,
      _id: newCode._id,
      role: "admin"
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate Admin Code", error });
  }
};

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
      role: "moderator"
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate Moderator Code", error });
  }
};

const promoteToModerator = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "moderator";
    await user.save();

    return res.status(200).json({ message: "User promoted to moderator", user });
  } catch (error) {
    return res.status(500).json({ message: "Error promoting user", error });
  }
};

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

module.exports = {
  generateAdminCode,
  generateModeratorCode,
  promoteToModerator,
  getCodes,
  deleteCode
};
