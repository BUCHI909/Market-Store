// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaStore, FaHistory } from "react-icons/fa";

const BottomNav = () => {
  return (
    <nav className="d-flex d-md-none justify-content-around align-items-center border-top bg-white fixed-bottom py-2">
      {[
        { to: "/dashboard", icon: <FaTachometerAlt /> },
        { to: "/dashboard/profile", icon: <FaUser /> },
        { to: "/dashboard/store", icon: <FaStore /> },
        { to: "/dashboard/activity", icon: <FaHistory /> },
      ].map((link, idx) => (
        <NavLink
          key={idx}
          to={link.to}
          className={({ isActive }) =>
            "text-center text-decoration-none" + (isActive ? " text-primary" : " text-secondary")
          }
        >
          {link.icon}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;