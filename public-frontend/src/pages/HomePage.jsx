import { useEffect, useState } from "react";
import { Link } from "react-router";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(
          "https://blog-app-hy2z.onrender.com/api/posts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const data = await response.json();

        setPosts(data.posts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="homepage">
      <section className="hero">
        <span className="hero-label">IDEAS WORTH SHARING</span>

        <h1>
          Stories, ideas and perspectives
          <span> that inspire.</span>
        </h1>

        <p>
          Discover thoughtful articles, explore new ideas,
          and learn something interesting every day.
        </p>

        <a href="#articles" className="hero-button">
          Explore Articles
        </a>
      </section>

      <section className="articles-section" id="articles">
        <div className="section-heading">
          <span className="section-label">OUR LATEST STORIES</span>
          <h2>Recent Articles</h2>
        </div>

        {posts.length === 0 ? (
          <p>No articles have been published yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card-content">
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>

                  <h3>{post.title}</h3>

                  <p>
                    {post.content.slice(0, 150)}
                    {post.content.length > 150 ? "..." : ""}
                  </p>

                  <div className="post-card-footer">
                    <span>
                      By {post.author?.username || "Unknown"}
                    </span>

                    <Link to={`/posts/${post.id}`}>
                      Read Article →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
