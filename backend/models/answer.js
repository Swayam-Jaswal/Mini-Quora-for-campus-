const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: false,
    trim: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [
    {
      url: { type: String },
      type: { type: String, enum: ["image", "document"], default: "document" }
    },
  ],
  isAnonymous: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
