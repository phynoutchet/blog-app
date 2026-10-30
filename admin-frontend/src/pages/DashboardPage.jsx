import { useEffect, useState } from "react";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    drafts: 0,
    totalComments: 0,
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
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
          throw new Error(data.message || "Failed to load dashboard");
        }

        setStats(data.stats);
        setPosts(data.posts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <main className="dashboard-content">Loading dashboard...</main>;
  }

  if (error) {
    return (
      <main className="dashboard-content">
        <h2>Unable to load dashboard</h2>
        <p className="dashboard-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your blog management dashboard.</p>
        </div>

        <span className="admin-badge">Administrator</span>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <p>Total Posts</p>
          <h2>{stats.totalPosts}</h2>
        </div>

        <div className="stat-card">
          <p>Published Posts</p>
          <h2>{stats.publishedPosts}</h2>
        </div>

        <div className="stat-card">
          <p>Drafts</p>
          <h2>{stats.drafts}</h2>
        </div>

        <div className="stat-card">
          <p>Total Comments</p>
          <h2>{stats.totalComments}</h2>
        </div>
      </section>

      <section className="recent-posts">
        <h2>Recent Posts</h2>

        {posts.length === 0 ? (
          <p>You haven't created any posts yet.</p>
        ) : (
          <div className="recent-posts-list">
            {posts.slice(0, 5).map((post) => (
              <div className="recent-post-item" key={post.id}>
                <div>
                  <h3>{post.title}</h3>
                  <p>By {post.author.username}</p>
                </div>

                <span
                  className={
                    post.published ? "status-published" : "status-draft"
                  }
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardPage;
