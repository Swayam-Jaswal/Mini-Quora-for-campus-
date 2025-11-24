const router = require("express").Router();
const { verifyToken, allowRoles } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/update.controller");


router.get("/", ctrl.listUpdates);
router.post(
"/",
verifyToken,
allowRoles("admin", "moderator", "superadmin"),
ctrl.createUpdate
);
router.post("/:id/like", verifyToken, ctrl.toggleLike);
router.post("/:id/comments", verifyToken, ctrl.addComment);
router.delete("/:id/comments/:commentId", verifyToken, ctrl.deleteComment);
router.delete(
"/:id",
verifyToken,
allowRoles("admin", "moderator", "superadmin"),
ctrl.deleteUpdate
);


module.exports = router;