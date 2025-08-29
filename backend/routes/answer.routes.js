const express = require('express');
const router = express.Router();
const { createAnswer, getAnswersByQuestion, updateAnswer, deleteAnswer} = require("../controllers/answer.controller");
const { verifyToken } = require('../middlewares/auth.middleware');

// No admin/mod restrictions here
router.post('/create-answer/:id', verifyToken, createAnswer);
router.get('/get-answers/:id', getAnswersByQuestion);
router.put('/update-answer/:id', verifyToken, updateAnswer);
router.delete('/delete-answer/:id', verifyToken, deleteAnswer);

module.exports = router;
