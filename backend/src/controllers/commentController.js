
const prisma = require("../lib/prisma");

async function getPostComments(req, res) {
  try {
    const postId = Number(req.params.postId);

    if (!Number.isInteger(postId) || postId < 1) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    // Only allow comments to be viewed on published posts.
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        published: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Published post not found",
      });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error retrieving comments:", error);

    return res.status(500).json({
      message: "Failed to retrieve comments",
    });
  }
}



async function createComment(req, res) {
  try {
    const postId = Number(req.params.postId);
    const { content } = req.body;

    if (!Number.isInteger(postId) || postId < 1) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        published: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Published post not found",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        authorId: req.user.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);

    return res.status(500).json({
      message: "Failed to create comment",
    });
  }
}



async function deleteComment(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);

    return res.status(500).json({
      message: "Failed to delete comment",
    });
  }
}


async function getAllComments(req, res) {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      message: "Failed to retrieve comments",
    });
  }
}



module.exports = {
  getPostComments,
  createComment,
  deleteComment,
  getAllComments
};
