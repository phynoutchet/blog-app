import { useEffect, useState } from "react";

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



async function handleDelete(commentId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmed) return;

  try {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(
      `http://localhost:3000/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    setComments((currentComments) =>
      currentComments.filter(
        (comment) => comment.id !== commentId
      )
    );
  } catch (error) {
    alert(error.message);
  }
}



  useEffect(() => {
    async function fetchComments() {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://localhost:3000/api/comments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, []);

  if (loading) return <main className="admin-content"><p>Loading comments...</p></main>;

  if (error) return <main className="admin-content"><p>{error}</p></main>;

  
return (
  <main className="admin-content">
    <div className="page-header">
      <div>
        <h1>Comments</h1>
        <p>Manage comments from your blog readers.</p>
      </div>
    </div>

    <div className="comments-list">
      {comments.length === 0 ? (
        <p>No comments have been posted yet.</p>
      ) : (
        comments.map((comment) => (
          <div className="comment-card" key={comment.id}>
            <div className="comment-card-header">
              <strong>
                {comment.author?.username || "Unknown user"}
              </strong>

              <span>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="comment-content">
              {comment.content}
            </p>

            <p className="comment-post">
              On post: <strong>{comment.post.title}</strong>
            </p>

            <button
              className="delete-button"
              onClick={() => handleDelete(comment.id)}
            >
              Delete Comment
            </button>
          </div>
        ))
      )}
    </div>
  </main>
);

}

export default CommentsPage;
