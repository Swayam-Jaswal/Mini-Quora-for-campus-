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

router.get('/', getAllAnnouncements);

router.post(
  '/',
  verifyToken,
  allowRoles("admin", "moderator", "superadmin"),
  createAnnouncement
);

router.put(
  '/:id',
  verifyToken,
  allowRoles("admin", "moderator", "superadmin"),
  updateAnnouncement
);

router.delete(
  '/:id',
  verifyToken,
  allowRoles("admin", "moderator", "superadmin"),
  deleteAnnouncement
);

module.exports = router;
