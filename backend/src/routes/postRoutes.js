const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const requireAdmin = require("../middleware/requireAdmin");
const { getPostComments, createComment} = require("../controllers/commentController");

const { getPublishedPosts, createPost, getPublishedPost, updatePost, deletePost, getAdminPosts } = require("../controllers/postController");

router.get("/", getPublishedPosts);
router.post("/", authenticateToken, requireAdmin, createPost)
router.get("/admin/all", authenticateToken, requireAdmin, getAdminPosts);
router.get("/:id", getPublishedPost);
router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  updatePost
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  deletePost
);
router.get("/:postId/comments", getPostComments);
router.post(
  "/:postId/comments",
  authenticateToken,
  createComment
);


module.exports = router;