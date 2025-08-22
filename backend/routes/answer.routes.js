const express = require('express');
const router = express.Router();
const { createAnswer, getAnswersByQuestion, updateAnswer, deleteAnswer} = require("../controllers/answer.controller");
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/create-answer/:id', verifyToken, createAnswer);
router.get('/get-answers/:id', getAnswersByQuestion);
router.delete('/delete-answer/:id',verifyToken,deleteAnswer);
router.put('/update-answer/:id',verifyToken,updateAnswer);

module.exports = router;