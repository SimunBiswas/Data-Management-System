import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DMS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {token ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/upload">
                  Upload
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  Search
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger nav-link text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
