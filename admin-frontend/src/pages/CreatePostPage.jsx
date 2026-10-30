
import { useState } from "react";
import { useNavigate, Link } from "react-router";

function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event, publish) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:3000/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            published: publish,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      navigate("/posts");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dashboard-content">
      <header className="posts-header">
        <div>
          <h1>Create New Post</h1>
          <p>Write and publish a new article.</p>
        </div>

        <Link to="/posts" className="back-button">
          Back to Posts
        </Link>
      </header>

      <form className="post-editor" onSubmit={(event) => handleSubmit(event, false)}>
        <div className="editor-field">
          <label htmlFor="title">Post Title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter your post title..."
            required
          />
        </div>

        <div className="editor-field">
          <label htmlFor="content">Post Content</label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Start writing your article..."
            rows="18"
            required
          />
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="editor-actions">
          <button
            type="submit"
            disabled={loading}
            className="draft-button"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>

          <button
            type="button"
            disabled={loading}
            className="publish-button"
            onClick={(event) => handleSubmit(event, true)}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreatePostPage;
