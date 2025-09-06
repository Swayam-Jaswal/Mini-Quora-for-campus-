const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middlewares/auth.middleware');
const { createAnnouncement, getAllAnnouncements, deleteAnnouncement } = require('../controllers/announcement.controller');

router.post(
  '/create-announcement',
  verifyToken,
  allowRoles("admin", "moderator"),
  createAnnouncement
);

router.get(
  '/get-announcements',
  verifyToken,
  allowRoles("admin", "moderator"),
  getAllAnnouncements
);

router.delete(
  '/delete-announcement/:id',
  verifyToken,
  allowRoles("admin", "moderator"),
  deleteAnnouncement
);

module.exports = router;
