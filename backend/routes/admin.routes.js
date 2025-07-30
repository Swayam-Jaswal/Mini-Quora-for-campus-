const express = require('express');
const {generateAdminCode} = require('../controllers/admin.controller');
const {verifyToken,verifyAdmin} = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const adminCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many admin code requests. Please try again later.",
  keyGenerator: (req) => {
    return req.user?.id || req.ip; 
  }
});
router.post("/generate-code",verifyToken,verifyAdmin,adminCodeLimiter,generateAdminCode);

module.exports = router;