
import { NavLink, useNavigate } from "react-router";

function Sidebar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

  navigate("/login", { replace: true });
}

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Blog Admin</h2>
        <p>Content Management</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/posts">
          All Posts
        </NavLink>

        <NavLink to="/posts/new">
          Create Post
        </NavLink>

        <NavLink to="/comments">
          Comments
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
            Logout
      </button>

      <div className="sidebar-footer">
        <p>Blog Management System</p>
      </div>

      
    </aside>
  );
}

export default Sidebar;
