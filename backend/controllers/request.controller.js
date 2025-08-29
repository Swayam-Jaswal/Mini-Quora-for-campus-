const Request = require("../models/request");
const Question = require("../models/question");
const Announcement = require("../models/announcements");

const createRequest = async (req, res) => {
  try {
    const { actionType, targetId } = req.body;

    const newRequest = await Request.create({
      actionType,
      targetId,
      requestedBy: req.user.id,
    });

    res.status(201).json({ message: "Request submitted", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error: error.message });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" })
      .populate("requestedBy", "name email role");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};


const reviewRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    request.reviewedBy = req.user.id;
    await request.save();

    if (status === "approved") {
      switch (request.actionType) {
        case "deleteQuestion":
          await Question.findByIdAndDelete(request.targetId);
          break;

        case "deleteAnnouncement":
          await Announcement.findByIdAndDelete(request.targetId);
          break;

        default:
          return res.status(400).json({ message: "Unknown action type" });
      }
    }
    res.json({ message: `Request ${status} and action executed`, request });
  } catch (error) {
    res.status(500).json({ message: "Error reviewing request", error: error.message });
  }
};

module.exports = {createRequest,getPendingRequests,reviewRequest};