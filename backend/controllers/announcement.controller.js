const Announcement = require("../models/announcements");

const createAnnouncement = async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Announcement body is required!" });
    }

    if (!["info", "deadline", "alert"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid announcement type" });
    }

    const newAnnouncement = new Announcement({
      text,
      type,
      author: req.user.id,
    });

    await newAnnouncement.save();

    // ✅ emit to all connected clients
    req.app.get("io").to("announcements").emit("announcement:new", newAnnouncement);

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Couldn't create announcement", error });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { text, type } = req.body;

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    if (!["admin", "moderator", "superadmin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to update announcement" });
    }

    if (text) announcement.text = text;
    if (type && ["info", "deadline", "alert"].includes(type)) {
      announcement.type = type;
    }

    await announcement.save();

    // ✅ emit update event
    req.app.get("io").to("announcements").emit("announcement:updated", announcement);

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Couldn't update announcement", error });
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
    return res
      .status(500)
      .json({ success: false, message: "Couldn't get announcements", error });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    if (!["admin", "moderator"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this announcement" });
    }

    await announcement.deleteOne();

    // ✅ emit delete event
    req.app.get("io").to("announcements").emit("announcement:deleted", req.params.id);

    return res
      .status(200)
      .json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Couldn't delete announcement", error });
  }
};

module.exports = {
  createAnnouncement,
  updateAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
};
