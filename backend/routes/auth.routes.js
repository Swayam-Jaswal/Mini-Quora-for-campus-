const express = require('express');
const User = require('../models/User');
const {verifyToken} = require('../middlewares/auth.middleware');
const router = express.Router();
const {signup,verifyEmail,login,logout} = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');
const validateSignup = require('../middlewares/validateSignup');
const handleValidation = require('../middlewares/handleValidation');

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many signup attempts from this IP, please try again later"
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts"
});

router.post('/signup', signupLimiter, validateSignup, handleValidation, signup);

router.get('/verify-email',verifyEmail);
router.post('/login',loginLimiter,login);
router.post('/logout',verifyToken,logout);
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
});

module.exports = router;