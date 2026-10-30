const prisma = require('../lib/prisma')

async function getPublishedPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    },
                },
            },
        })

        res.json({ posts })
    } catch (error) {
        console.error ('Error fetching posts:', error)

        res.status(500).json({
            message: 'Failed to retreive posts',
        })
    }
}


async function getPublishedPost(req, res) {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "Invalid post id"
            })
        }

        const post = await prisma.post.findFirst({
            where: {
                id,
                published: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        })

        if (!post) {
            res.status(404).json({
                message: "Post not found"
            })
        }

        return res.json({ post })
    } catch(error) {
        console.error('Error fetching post:', error)

        return res.status(500).json({
            message: "Failed to retrieve post"
        })
    }
}



async function createPost(req, res) {
  try {
    const { title, content, published } = req.body;

    // Get the author's ID from the authenticated admin's JWT.
    const authorId = req.user.userId;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim() ||
      !Number.isInteger(authorId) ||
      authorId < 1
    ) {
      return res.status(400).json({
        message: "Valid title and content are required",
      });
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      return res.status(404).json({
        message: "Author not found!",
      });
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId,
        published: published === true,
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

    return res.status(201).json({ post });
  } catch (error) {
    console.error("Error creating post:", error);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
}



async function updatePost(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const { title, content, published } = req.body;

    // Only allow the fields that an administrator may update.
    const data = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Title must be a non-empty string",
        });
      }

      data.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          message: "Content must be a non-empty string",
        });
      }

      data.content = content.trim();
    }

    if (published !== undefined) {
      if (typeof published !== "boolean") {
        return res.status(400).json({
          message: "Published must be true or false",
        });
      }

      data.published = published;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);

    return res.status(500).json({
      message: "Failed to update post",
    });
  }
}



async function deletePost(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);

    return res.status(500).json({
      message: "Failed to delete post",
    });
  }
}


async function getAdminPosts(req, res) {
  try {
    const [posts, totalPosts, publishedPosts, drafts, totalComments] =
      await Promise.all([
        prisma.post.findMany({
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
            _count: {
              select: {
                comments: true,
              },
            },
          },
        }),

        prisma.post.count(),

        prisma.post.count({
          where: { published: true },
        }),

        prisma.post.count({
          where: { published: false },
        }),

        prisma.comment.count(),
      ]);

    res.json({
      posts,
      stats: {
        totalPosts,
        publishedPosts,
        drafts,
        totalComments,
      },
    });
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    res.status(500).json({
      message: "Failed to retrieve admin posts",
    });
  }
}


module.exports = { getPublishedPosts, createPost, getPublishedPost, updatePost, deletePost, getAdminPosts }