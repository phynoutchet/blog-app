import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CommentSection from "../components/CommentSection";

function PostPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(
          `https://blog-app-hy2z.onrender.com/api/posts/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve this article");
        }

        const data = await response.json();

        setPost(data.post);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return <p>Loading article...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="post-page">
      <Link to="/" className="back-link">
        ← Back to articles
      </Link>

      <article className="full-post">
        <span className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>

        <h1>{post.title}</h1>

        <p className="post-author">
          Written by {post.author?.username || "Unknown"}
        </p>

        <div className="post-content">
          {post.content}
        </div>
      </article>
      <CommentSection postId={post.id} />
    </main>
  );
}

export default PostPage;
