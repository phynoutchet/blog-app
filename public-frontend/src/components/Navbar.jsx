import { Link } from "react-router";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        My Blog
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <span className="nav-user">
              Hi, {user.username}
            </span>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>

            <a href="http://localhost:5173/login">
                Admin
            </a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register" className="register-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
