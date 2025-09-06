const Announcement = require("../models/announcements");

const createAnnouncement = async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Announcement body is required!" });
    }

    if (!["info", "warning", "alert"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid announcement type" });
    }

    const newAnnouncement = new Announcement({
      text,
      type,
      author: req.user._id,
    });

    await newAnnouncement.save();

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Couldn't create announcement", error });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All announcements fetched",
      data: announcements,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Couldn't get announcements", error });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    if (!["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this announcement" });
    }
    await announcement.deleteOne();
    return res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Couldn't delete announcement", error });
  }
};

module.exports = { createAnnouncement, getAllAnnouncements, deleteAnnouncement };