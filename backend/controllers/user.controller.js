const User = require("../models/user");
const bcrypt = require("bcrypt");

// Get profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -verificationTokenHash -verificationExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update profile
exports.updateMyProfile = async (req, res) => {
  try {
    const allowed = [
      "name",
      "bio",
      "tagline",
      "skills",
      "avatar", // legacy single avatar
      "avatars",
      "activeAvatar",
      "banner",
      "social",
      "anonymousMode",
      "privateProfile",
    ];

    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    // Skills normalize
    if (typeof updates.skills === "string") {
      updates.skills = updates.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // ✅ Social normalize
    if (updates.social) {
      ["github", "linkedin", "instagram"].forEach((platform) => {
        if (updates.social[platform] === undefined) return;
        if (!updates.social[platform]) {
          updates.social[platform] = "";
        }
      });
    }

    // ✅ Avatars handling
    if (updates.avatar) {
      // legacy: single avatar becomes activeAvatar
      updates.activeAvatar = updates.avatar;
      if (!updates.avatars) updates.avatars = [updates.avatar];
      delete updates.avatar;
    }

    if (updates.avatars && Array.isArray(updates.avatars)) {
      updates.avatars = updates.avatars.filter(Boolean);
      // ensure activeAvatar is valid
      if (!updates.activeAvatar && updates.avatars.length > 0) {
        updates.activeAvatar = updates.avatars[0];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -verificationTokenHash -verificationExpires");

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get another user's public profile by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verificationTokenHash -verificationExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
