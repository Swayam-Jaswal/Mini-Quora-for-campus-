const express = require('express');
const {generateAdminCode} = require('../controllers/admin.controller');
const {verifyToken,verifyAdmin} = require('../middlewares/auth.middleware');
const router = express.Router();

router.post("/generate-code",verifyToken,verifyAdmin,generateAdminCode);

module.exports = router;