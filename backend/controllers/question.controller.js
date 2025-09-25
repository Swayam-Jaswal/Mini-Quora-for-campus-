// controllers/question.controller.js
const Question = require("../models/question");
const Answer = require("../models/answer");
const maskAuthor = require("../utils/maskAuthor");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    if (!title || !body)
      return res.status(400).json({ message: "title and body are required" });
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized: no user found" });

    const isAnonymous = req.user.anonymousMode === true;

    const question = new Question({
      title,
      body,
      tags,
      isAnonymous,
      author: req.user.id,
    });
    await question.save();
    await question.populate(
      "author",
      "_id name email role avatar activeAvatar"
    );

    const obj = maskAuthor(question);

    const io = req.app.get("io");
    io.emit("questionCreated", { question: { ...obj, answersCount: 0 } });

    return res
      .status(200)
      .json({ message: "question created successfully", question: obj });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "couldnt create question", error: error.message });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "_id name email role avatar activeAvatar")
      .sort({ createdAt: -1 });

    const questionsWithCount = await Promise.all(
      questions.map(async (q) => {
        const count = await Answer.countDocuments({ question: q._id });
        return { ...maskAuthor(q), answersCount: count };
      })
    );

    return res.status(200).json({
      message: "fetched all questions",
      questions: questionsWithCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "couldnt get all questions", error: error.message });
  }
};

// Get single question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate(
      "author",
      "_id name email role avatar activeAvatar"
    );
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const answersCount = await Answer.countDocuments({ question: id });
    const obj = maskAuthor(question);

    return res.status(200).json({ question: { ...obj, answersCount } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error fetching question", error: error.message });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, tags } = req.body;

    const question = await Question.findById(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (
      question.author.toString() !== req.user.id &&
      !["admin", "moderator"].includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "you cannot edit this question" });
    }

    question.title = title || question.title;
    question.body = body || question.body;
    question.tags = tags || question.tags;

    if (!question.isAnonymous) {
      question.isAnonymous = req.user.anonymousMode === true;
    }

    await question.save();
    await question.populate(
      "author",
      "_id name email role avatar activeAvatar"
    );

    const obj = maskAuthor(question);

    const io = req.app.get("io");
    io.emit("questionUpdated", { question: obj });

    return res
      .status(200)
      .json({ message: "Question updated successfully", question: obj });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Couldn't update question", error: error.message });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    if (
      question.author.toString() !== req.user.id &&
      !["admin", "moderator"].includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "you cannot delete this question" });
    }

    await Question.findByIdAndDelete(id);
    await Answer.deleteMany({ question: id });

    const io = req.app.get("io");
    io.emit("questionDeleted", { questionId: id });

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Couldn't delete Question", error: error.message });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
