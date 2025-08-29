const express = require('express');
const router = express.Router();
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } = require("../controllers/question.controller");
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/create-question', verifyToken, createQuestion);
router.get('/get-questions', getAllQuestions);
router.get('/get-question/:id', getQuestionById);
router.put('/update-question/:id', verifyToken, updateQuestion);
router.delete('/delete-question/:id', verifyToken, deleteQuestion);

module.exports = router;
