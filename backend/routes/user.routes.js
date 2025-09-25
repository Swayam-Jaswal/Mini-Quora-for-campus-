const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { getMyProfile, updateMyProfile,getUserById, changePassword  } = require("../controllers/user.controller");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put("/me/password", verifyToken, changePassword);
router.get("/:id", getUserById);

module.exports = router;