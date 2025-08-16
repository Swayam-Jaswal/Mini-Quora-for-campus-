const express = require('express');
const router = express.Router();
const { createQuestion, getAllQuestions, getQuestionById } = require("../controllers/question.controller");
const {verifyToken} = require('../middlewares/auth.middleware');

router.post('/create-question',verifyToken,createQuestion);
router.get("/get-all-questions", getAllQuestions);
router.get("/get-question/:id", getQuestionById);

module.exports = router;