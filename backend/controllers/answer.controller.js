const Answer = require("../models/answer");

const createAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    const { id } = req.params;

    if (!body) {
      return res.status(400).json({ message: "Answer body is required" });
    }

    const answer = new Answer({
      body,
      question: id,
      author: req.user.id,
    });

    await answer.save();
    await answer.populate("author", "_id name email role");

    return res
      .status(200)
      .json({ message: "Answer created successfully", answer });
  } catch (error) {
    return res.status(500).json({ message: "Error creating answer", error });
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
    return res.status(500).json({ message: "Error fetching answers", error });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You cannot edit this answer" });
    }

    answer.body = body || answer.body;
    await answer.save();
    await answer.populate("author", "_id name email role");

    return res
      .status(200)
      .json({ message: "Answer updated successfully", answer });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't update answer", error });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;

    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You cannot delete this answer" });
    }

    await Answer.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Answer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't delete answer", error });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
};
