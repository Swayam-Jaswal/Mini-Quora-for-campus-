// announcement.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');
const {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
} = require('../controllers/announcement.controller');

// GET all announcements (public)
router.get('/', getAllAnnouncements);

// POST create announcement (restricted)
router.post(
  '/',
  verifyToken,
  allowRoles("admin", "moderator", "superadmin"),
  createAnnouncement
);

// PUT update announcement (restricted)
router.put(
  '/:id',
  verifyToken,
  allowRoles("admin", "moderator", "superadmin"),
  updateAnnouncement
);

// DELETE announcement (restricted)
router.delete(
  '/:id',
  verifyToken,
  allowRoles("admin", "moderator", "superadmin"),
  deleteAnnouncement
);

module.exports = router;
