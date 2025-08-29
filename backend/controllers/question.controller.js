const Question = require('../models/question');
const Answer = require('../models/answer');

const createQuestion = async (req, res) => {
  try {
    const { title, body, tags, isAnonymous } = req.body;
    if (!title || !body) return res.status(400).json({ message: "title and body are required" });
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized: no user found" });

    const question = new Question({
      title,
      body,
      tags,
      isAnonymous,
      author: req.user.id,
    });
    await question.save();
    await question.populate("author", "name email role _id");

    const io = req.app.get("io");
    io.emit("questionCreated", { question: { ...question.toObject(), answersCount: 0 } });

    return res.status(200).json({ message: "question created successfully", question });
  } catch (error) {
    return res.status(500).json({ message: "couldnt create question", error });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    const questionsWithCount = await Promise.all(
      questions.map(async (q) => {
        const count = await Answer.countDocuments({ question: q._id });
        return { ...q.toObject(), answersCount: count };
      })
    );

    return res.status(200).json({ message: "fetched all questions", questions: questionsWithCount });
  } catch (error) {
    return res.status(500).json({ message: "couldnt get all questions", error });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id).populate("author", "name email role");
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answersCount = await Answer.countDocuments({ question: id });

    return res.status(200).json({ question: { ...question.toObject(), answersCount } });
  } catch (error) {
    return res.status(500).json({ message: "error fetching question", error });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, tags, isAnonymous } = req.body;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.author.toString() !== req.user.id &&
        !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "you cannot edit this question" });
    }

    question.title = title || question.title;
    question.body = body || question.body;
    question.tags = tags || question.tags;
    question.isAnonymous = isAnonymous ?? question.isAnonymous;

    await question.save();
    await question.populate("author", "name email role _id");

    const io = req.app.get("io");
    io.emit("questionUpdated", { question: question.toObject() });

    return res.status(200).json({ message: "Question updated successfully", question });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't update question", error });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.author.toString() !== req.user.id &&
        !["admin", "moderator"].includes(req.user.role)) {
      return res.status(403).json({ message: "you cannot delete this question" });
    }

    await Question.findByIdAndDelete(id);
    await Answer.deleteMany({ question: id });

    const io = req.app.get("io");
    io.emit("questionDeleted", { questionId: id });

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't delete Question", error });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
