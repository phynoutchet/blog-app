import { useEffect, useState } from "react";
import { Link } from "react-router";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          `https://blog-app-hy2z.onrender.com/api/posts/${postId}/comments`
        );

        if (!response.ok) {
          throw new Error("Failed to load comments");
        }

        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitError("Please log in before submitting a comment.");
      return;
    }

    if (!content.trim()) {
      setSubmitError("Your comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(
        `https://blog-app-hy2z.onrender.com/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: content.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit comment");
      }

      setComments((previousComments) => [
        ...previousComments,
        data.comment,
      ]);

      setContent("");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="comments-section">
      <h2>Comments ({comments.length})</h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        <label htmlFor="comment">Leave a comment</label>

        <textarea
          id="comment"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share your thoughts..."
          rows="4"
        />

        {submitError && (
          <p className="comment-error">{submitError}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Comment"}
        </button>

        
        {!localStorage.getItem("token") ? (
            <p className="login-hint">
                You need to <Link to="/login">log in</Link> to leave a comment.
                Don't have an account? <Link to="/register">Sign up</Link>.
            </p>
            ) : (
                <p className="login-hint">
                    You're logged in. Share your thoughts below.
                 </p>
                )}

      </form>

      {comments.length === 0 ? (
        <p>Be the first to comment on this article.</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              <h4>
                {comment.author?.username || "Anonymous"}
              </h4>

              <p>{comment.content}</p>

              <span>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default CommentSection;
