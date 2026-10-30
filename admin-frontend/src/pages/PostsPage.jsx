import { useEffect, useState } from "react";
import { Link } from "react-router";

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://localhost:3000/api/posts/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch posts");
        }

        setPosts(data.posts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main className="dashboard-content">
      <header className="posts-header">
        <div>
          <h1>All Posts</h1>
          <p>Manage your blog articles and drafts.</p>
        </div>

        <Link to="/posts/new" className="create-post-button">
          + Create Post
        </Link>
      </header>

      {loading && <p>Loading posts...</p>}

      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-posts">
          <h2>No posts yet</h2>
          <p>Create your first blog post to get started.</p>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="post-title-cell">{post.title}</td>
                  <td>{post.author.username}</td>

                  <td>
                    <span
                      className={
                        post.published
                          ? "status-published"
                          : "status-draft"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td>{post._count.comments}</td>

                  <td>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="edit-post-link"
                    >
                      Edit
                    </Link>
                    
                    <button
                    className="delete-button"
                    onClick={() => handleDelete(post.id)}
                    >
                    Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );




async function handleDelete(postId) {
  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this post?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(
      `http://localhost:3000/api/posts/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete post");
    }

    // Remove the deleted post from the page immediately.
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  } catch (error) {
    alert(error.message);
  }
}


}

export default PostsPage;
