import React from "react";
import { FaShoppingCart, FaWallet, FaChartLine } from "react-icons/fa";

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="card shadow-sm border-0 p-4 mb-4">
      <div className="d-flex align-items-center">
        <div className="me-3 display-6 text-primary">{icon}</div>
        <div>
          <h6 className="text-muted">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;