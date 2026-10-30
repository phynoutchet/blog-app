const express = require("express");
const router = express.Router();

const { deleteComment, getAllComments } = require("../controllers/commentController");
const authenticateToken = require("../middleware/authenticateToken");
const requireAdmin = require("../middleware/requireAdmin");

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deleteComment
);
router.get("/", authenticateToken, requireAdmin, getAllComments);


module.exports = router;
