const express = require('express');
const User = require('../models/User');
const {verifyToken} = require('../middlewares/auth.middleware');
const router = express.Router();
const {signup,verifyEmail,login,logout} = require('../controllers/auth.controller');
const rateLimit = require('express-rate-limit');
const validateSignup = require('../middlewares/validateSignup');
const { validationResult } = require('express-validator');

const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many signup attempts from this IP, please try again later"
});

router.post('/signup',signupLimiter ,validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return signup(req, res);
});

// router.post('/signup',signupLimiter,signup);
router.get('/verify-email',verifyEmail);
router.post('/login',login);
router.post('/logout',verifyToken,logout);

module.exports = router;