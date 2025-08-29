const express = require("express");
const { createRequest, getPendingRequests, reviewRequest } = require("../controllers/request.controller");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", verifyToken, createRequest);
router.get("/all", verifyToken, checkRole("moderator"), getPendingRequests);
router.put("/review/:id", verifyToken, checkRole("admin"), reviewRequest);

module.exports = router;