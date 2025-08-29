const Answer = require("../models/answer");
const Question = require("../models/question");

const createAnswer = async (req, res) => {
  try {
    const { body, isAnonymous, attachments = [] } = req.body;
    const { id } = req.params;

    if ((!body || !body.trim?.()) && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: "Answer body or attachments required" });
    }

    const answer = new Answer({
      body: body?.trim() || "",
      isAnonymous: isAnonymous || false,
      question: id,
      author: req.user.id,
      attachments,
    });

    await answer.save();
    await answer.populate("author", "_id name email role");

    await Question.findByIdAndUpdate(id, { $inc: { answersCount: 1 } });

    const io = req.app.get("io");
    io.emit("answerCreated", { questionId: id, answer });

    return res.status(200).json({ message: "Answer created successfully", answer });
  } catch (error) {
    return res.status(500).json({ message: "Error creating answer", error: error?.message || error });
  }
};

const getAnswersByQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const answers = await Answer.find({ question: id })
      .populate("author", "_id name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ answers });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching answers", error: error?.message || error });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, attachments } = req.body;

    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.author.toString() !== req.user.id &&
        !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "You cannot edit this answer" });
    }

    if (typeof body !== "undefined") answer.body = body?.trim?.() || "";
    if (Array.isArray(attachments)) answer.attachments = attachments;

    await answer.save();
    await answer.populate("author", "_id name email role");

    const io = req.app.get("io");
    io.emit("answerUpdated", { questionId: answer.question.toString(), answer });

    return res.status(200).json({ message: "Answer updated successfully", answer });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't update answer", error: error?.message || error });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.author.toString() !== req.user.id &&
        !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "You cannot delete this answer" });
    }

    const qid = answer.question.toString();
    await Answer.findByIdAndDelete(id);
    await Question.findByIdAndUpdate(qid, { $inc: { answersCount: -1 } });

    const io = req.app.get("io");
    io.emit("answerDeleted", { questionId: qid, answerId: id });

    return res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't delete answer", error: error?.message || error });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
};
