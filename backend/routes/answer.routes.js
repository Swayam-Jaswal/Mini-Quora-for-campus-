const express = require('express');
const router = express.Router();
const { createAnswer, getAnswersByQuestion } = require("../controllers/answer.controller");
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/create-answer/:id', verifyToken, createAnswer);
router.get('/get-answers/:id', getAnswersByQuestion);

module.exports = router;