const express = require('express');
const { verifyToken, allowRoles, checkRole } = require('../middlewares/auth.middleware');
const {
  generateAdminCode,
  generateModeratorCode,
  promoteToModerator,
  getCodes,
  deleteCode,
  getStats,
  getUsers,
  deleteUserById,
} = require('../controllers/admin.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Limit admin code generation
const adminCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many admin code requests. Please try again later.",
  keyGenerator: (req) => req.user?.id || req.ip,
});

// Code management (admin-only)
router.post("/generate-admin-code", verifyToken, checkRole("admin"), adminCodeLimiter, generateAdminCode);
router.post("/generate-moderator-code", verifyToken, checkRole("admin"), generateModeratorCode);
router.put("/promote-to-moderator", verifyToken, checkRole("admin"), promoteToModerator);
router.get("/codes", verifyToken, checkRole("admin"), getCodes);
router.delete("/codes/:id", verifyToken, checkRole("admin"), deleteCode);

// Dashboard stats (admin + moderator)
router.get("/stats", verifyToken, allowRoles("admin", "moderator"), getStats);

// Users management (admin-only)
router.get("/users", verifyToken, checkRole("admin"), getUsers);
router.delete("/users/:id", verifyToken, checkRole("admin"), deleteUserById);

module.exports = router;
