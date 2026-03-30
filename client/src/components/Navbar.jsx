// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import {
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaHome,
  FaStore,
  FaUserPlus,
  FaSignInAlt,
  FaUserCircle
} from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="shadow-sm py-3"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="container d-flex justify-content-between align-items-center"
        style={{ maxWidth: "1140px" }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="d-flex align-items-center text-decoration-none logo-hover"
          style={{
            fontSize: "1.9rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          <span className="market" style={{ color: "#0d6efd" }}>
            Market
          </span>

          <FaShoppingBag
            size={22}
            style={{ margin: "0 8px", color: "#6610f2" }}
          />

          <span className="sphere" style={{ color: "#6610f2" }}>
            Sphere
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="d-none d-lg-flex align-items-center gap-4">

          <NavLink
            to="/"
            className="nav-link d-flex align-items-center gap-2"
            style={{ color: "#0b3d91", fontWeight: 500 }}
          >
            <FaHome />
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className="nav-link d-flex align-items-center gap-2"
            style={{ color: "#0b3d91", fontWeight: 500 }}
          >
            <FaStore />
            Shop
          </NavLink>

          <NavLink
            to="/become-seller"
            className="nav-link d-flex align-items-center gap-2"
            style={{ color: "#0b3d91", fontWeight: 500 }}
          >
            <FaUserPlus />
            Become Seller
          </NavLink>

          <Link
            to="/login"
            className="btn btn-outline-primary px-4 fw-semibold d-flex align-items-center gap-2 shadow-sm"
          >
            <FaSignInAlt />
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2 shadow"
          >
            <FaUserCircle />
            Register
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="d-lg-none">
          <button
            className="btn"
            onClick={() => setIsOpen(!isOpen)}
            style={{ fontSize: "1.5rem", color: "#0d6efd" }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="d-lg-none bg-white shadow-lg w-100"
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            padding: "25px 0",
            borderTop: "1px solid #eee"
          }}
        >
          <div className="d-flex flex-column align-items-center gap-4">

            <NavLink
              to="/"
              className="nav-link d-flex align-items-center gap-2"
              onClick={() => setIsOpen(false)}
              style={{ color: "#0b3d91", fontWeight: 500 }}
            >
              <FaHome />
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className="nav-link d-flex align-items-center gap-2"
              onClick={() => setIsOpen(false)}
              style={{ color: "#0b3d91", fontWeight: 500 }}
            >
              <FaStore />
              Shop
            </NavLink>

            <NavLink
              to="/become-seller"
              className="nav-link d-flex align-items-center gap-2"
              onClick={() => setIsOpen(false)}
              style={{ color: "#0b3d91", fontWeight: 500 }}
            >
              <FaUserPlus />
              Become Seller
            </NavLink>

            <Link
              to="/login"
              className="btn btn-outline-primary px-4 fw-semibold d-flex align-items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FaSignInAlt />
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FaUserCircle />
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Hover Effects */}
      <style>
        {`
        .logo-hover:hover{
          transform: scale(1.03);
        }

        .market:hover, .sphere:hover {
          font-weight: 800;
          transform: translateY(-2px);
        }

        .nav-link {
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #0d6efd !important;
          font-weight: 600;
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: #0d6efd !important;
          font-weight: 700;
          border-bottom: 2px solid #0d6efd;
          padding-bottom: 2px;
        }

        .btn-primary {
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #0b5ed7 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.1);
        }

        .btn-outline-primary:hover {
          background-color: #0d6efd !important;
          color: #fff !important;
          transform: translateY(-2px);
        }
        `}
      </style>
    </nav>
  );
};

export default Navbar;