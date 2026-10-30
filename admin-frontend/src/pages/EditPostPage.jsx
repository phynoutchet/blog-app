import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          `http://localhost:3000/api/posts/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to retrieve posts");
        }

        const post = data.posts.find(
          (item) => item.id === Number(id)
        );

        if (!post) {
          throw new Error("Post not found");
        }

        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:3000/api/posts/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            published,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      navigate("/posts");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="dashboard-content">
        Loading post...
      </main>
    );
  }

  if (error && !title) {
    return (
      <main className="dashboard-content">
        <h2>Unable to load post</h2>
        <p className="dashboard-error">{error}</p>
        <Link to="/posts">Back to Posts</Link>
      </main>
    );
  }

  return (
    <main className="dashboard-content">
      <header className="posts-header">
        <div>
          <h1>Edit Post</h1>
          <p>Update your article and publication status.</p>
        </div>

        <Link to="/posts" className="back-button">
          Back to Posts
        </Link>
      </header>

      <form className="post-editor" onSubmit={handleSubmit}>
        <div className="editor-field">
          <label htmlFor="title">Post Title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="editor-field">
          <label htmlFor="content">Post Content</label>

          <textarea
            id="content"
            rows="18"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </div>

        <label className="publish-toggle">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />

          Published
        </label>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="editor-actions">
          <button
            type="submit"
            disabled={saving}
            className="publish-button"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditPostPage;
