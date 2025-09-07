const express = require('express');
const { verifyToken, allowRoles, checkRole } = require('../middlewares/auth.middleware');
const {
  generateAdminCode,
  generateModeratorCode,
  promoteToModerator,
  promoteToAdmin,
  demoteToUser,
  demoteAdminToUser,
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

// === Superadmin-only routes ===
router.post("/generate-admin-code", verifyToken, checkRole("superadmin"), adminCodeLimiter, generateAdminCode);
router.put("/promote-to-admin", verifyToken, checkRole("superadmin"), promoteToAdmin);
router.put("/demote-admin-to-user", verifyToken, checkRole("superadmin"), demoteAdminToUser);

// === Admin + Superadmin routes ===
router.post("/generate-moderator-code", verifyToken, checkRole("admin"), generateModeratorCode);
router.put("/promote-to-moderator", verifyToken, checkRole("admin"), promoteToModerator);
router.put("/demote-to-user", verifyToken, checkRole("admin"), demoteToUser);
router.get("/codes", verifyToken, checkRole("admin"), getCodes);
router.delete("/codes/:id", verifyToken, checkRole("admin"), deleteCode);

// === Dashboard stats (admin + moderator + superadmin) ===
router.get("/stats", verifyToken, allowRoles("admin", "moderator"), getStats);

// === User management (admin + superadmin) ===
router.get("/users", verifyToken, checkRole("admin"), getUsers);
router.delete("/users/:id", verifyToken, checkRole("admin"), deleteUserById);

module.exports = router;
