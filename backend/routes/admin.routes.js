const express = require('express');
const { generateAdminCode, generateModeratorCode, promoteToModerator } = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const adminCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many admin code requests. Please try again later.",
  keyGenerator: (req) => req.user?.id || rateLimit.ipKeyGenerator(req),
});

router.post("/generate-code", verifyToken, checkRole("admin"), adminCodeLimiter, generateAdminCode);
router.post("/generate-moderator-code", verifyToken, checkRole("admin"), generateModeratorCode);
router.put("/promote-to-moderator", verifyToken, checkRole("admin"), promoteToModerator);

module.exports = router;