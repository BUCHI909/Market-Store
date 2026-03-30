import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call your logout API
    fetch("http://localhost:5000/api/auth/logout", { credentials: "include" })
      .then(() => {
        localStorage.clear(); // if using localStorage for auth
        navigate("/dashboard");
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <div style={{ padding: 25 }}>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;