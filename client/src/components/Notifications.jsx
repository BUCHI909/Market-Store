import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import { FaBell } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  if (loading) return <div className="text-center py-5">Loading notifications...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4"><FaBell className="me-2" /> Notifications</h3>
      {notifications.length === 0 && <p className="text-muted">You have no new notifications.</p>}
      <ul className="list-group">
        {notifications.map(n => (
          <li key={n.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{n.title}</strong>
              <p className="mb-0 text-muted">{n.message}</p>
            </div>
            <span className="badge bg-primary rounded-pill">{new Date(n.created_at).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;