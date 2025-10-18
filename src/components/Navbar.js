import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link text-white fw-bold" : "nav-link text-secondary";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <img src="logo1.png" alt="logo" style={{ "width" : "30px"}} className="me-3" />
          <span className="fw-semibold">Document Management System</span>
        </NavLink>
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
                <NavLink to="/upload" className={getNavLinkClass}>
                  Upload
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/search" className={getNavLinkClass}>
                  Search
                </NavLink>
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
                <NavLink to="/" className={getNavLinkClass}>
                  Login
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
