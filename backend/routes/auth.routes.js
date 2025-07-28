const express = require('express');
const User = require('../models/User');
const {verifyToken} = require('../middlewares/auth.middleware');
const router = express.Router();
const {signup,verifyEmail,login,logout} = require('../controllers/auth.controller');

router.post('/signup',signup);
router.get('/verify-email',verifyEmail);
router.post('/login',login);
router.post('/logout',verifyToken,logout);

module.exports = router;