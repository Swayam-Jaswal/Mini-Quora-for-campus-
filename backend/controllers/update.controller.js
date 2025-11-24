"use strict";

const Update = require("../models/update");

const isAdminOrMod = (user) => {
  if (!user) return false;
  const role = String(user.role || "").toLowerCase();
  return (
    ["admin", "moderator", "mod", "superadmin"].includes(role) ||
    user.isAdmin ||
    user.isModerator
  );
};

// Create update (accepts Cloudinary URLs in body.images)
exports.createUpdate = async (req, res) => {
  try {
    if (!isAdminOrMod(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title = "", body = "" } = req.body;

    // Normalize images (array or string/JSON)
    let images = [];
    if (Array.isArray(req.body.images)) {
      images = req.body.images.filter(Boolean);
    } else if (typeof req.body.images === "string") {
      try {
        const parsed = JSON.parse(req.body.images);
        if (Array.isArray(parsed)) images = parsed.filter(Boolean);
        else if (req.body.images.trim()) images = [req.body.images.trim()];
      } catch {
        if (req.body.images.trim()) images = [req.body.images.trim()];
      }
    }

    const doc = await Update.create({
      author: req.user._id,
      title,
      body,
      images,
    });

    const populated = await Update.findById(doc._id)
      .populate("author", "name username email role")
      .populate("comments.user", "name username email role");

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.listUpdates = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const updates = await Update.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name username email role")
      .populate("comments.user", "name username email role");

    const total = await Update.countDocuments();
    res.json({ page, limit, total, updates });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const upd = await Update.findById(id);
    if (!upd) return res.status(404).json({ message: "Not found" });

    const uid = String(req.user._id);
    const has = upd.likes.some((x) => String(x) === uid);
    upd.likes = has
      ? upd.likes.filter((x) => String(x) !== uid)
      : [...upd.likes, req.user._id];

    await upd.save();

    const populated = await Update.findById(id)
      .populate("author", "name username email role")
      .populate("comments.user", "name username email role");

    res.json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const upd = await Update.findById(id);
    if (!upd) return res.status(404).json({ message: "Not found" });

    upd.comments.push({ user: req.user._id, text: text.trim() });
    await upd.save();

    const populated = await Update.findById(id)
      .populate("author", "name username email role")
      .populate("comments.user", "name username email role");

    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const upd = await Update.findById(id);
    if (!upd) return res.status(404).json({ message: "Not found" });

    const comment = upd.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = String(comment.user) === String(req.user._id);
    if (!isOwner && !isAdminOrMod(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (typeof comment.deleteOne === "function") await comment.deleteOne();
    else comment.remove();

    await upd.save();

    const populated = await Update.findById(id)
      .populate("author", "name username email role")
      .populate("comments.user", "name username email role");

    res.json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const upd = await Update.findById(id);
    if (!upd) return res.status(404).json({ message: "Not found" });

    const isOwner = String(upd.author) === String(req.user._id);
    if (!(isOwner && isAdminOrMod(req.user)) && !isAdminOrMod(req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await upd.deleteOne();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
