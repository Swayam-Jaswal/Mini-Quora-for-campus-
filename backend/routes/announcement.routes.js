const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles, checkRole } = require('../middlewares/auth.middleware');
const { createAnnouncement, getAllAnnouncements, deleteAnnouncement } = require('../controllers/announcement.controller');

router.post('/create-announcement', verifyToken, allowRoles("admin", "moderator"), createAnnouncement);
router.get('/get-announcements', verifyToken, checkRole("admin","moderator"), getAllAnnouncements);
router.delete('/delete-announcement/:id', verifyToken, allowRoles("admin", "moderator"), deleteAnnouncement);

module.exports = router;``