const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { getMyProfile, updateMyProfile, changePassword  } = require("../controllers/user.controller");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);
router.put("/me/password", verifyToken, changePassword);

module.exports = router;
