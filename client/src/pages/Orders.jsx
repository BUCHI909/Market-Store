// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../utils/api";
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-warning" />;
      case 'confirmed':
        return <FaCheckCircle className="text-info" />;
      case 'shipped':
        return <FaTruck className="text-primary" />;
      case 'delivered':
        return <FaCheckCircle className="text-success" />;
      default:
        return <FaBox className="text-secondary" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status?.toLowerCase() === 'pending').length,
    shipped: orders.filter(o => o.status?.toLowerCase() === 'shipped').length,
    delivered: orders.filter(o => o.status?.toLowerCase() === 'delivered').length
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "30px 24px",
        color: "white",
        borderRadius: "0 0 30px 30px"
      }}>
        <h1 className="fw-bold mb-2">My Orders</h1>
        <p className="mb-0 opacity-75">Track and manage your orders</p>
      </div>

      {/* Stats Cards */}
      <div className="container px-3 mt-4">
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <h3 className="fw-bold mb-0 text-primary">{stats.total}</h3>
              <small className="text-muted">Total Orders</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <h3 className="fw-bold mb-0 text-warning">{stats.pending}</h3>
              <small className="text-muted">Pending</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <h3 className="fw-bold mb-0 text-primary">{stats.shipped}</h3>
              <small className="text-muted">Shipped</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <h3 className="fw-bold mb-0 text-success">{stats.delivered}</h3>
              <small className="text-muted">Delivered</small>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn ${filter === status ? 'btn-primary' : 'btn-light'} rounded-pill px-4`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="card border-0 shadow-sm text-center p-5">
            <FaShoppingBag size={60} className="text-muted mb-3 mx-auto" />
            <h5 className="fw-bold">No Orders Yet</h5>
            <p className="text-muted">Start shopping to see your orders here</p>
            <button 
              className="btn btn-primary mt-3 mx-auto"
              onClick={() => navigate('/shop')}
              style={{ maxWidth: '200px' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="col-12">
                <div className="card border-0 shadow-sm hover-shadow">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-1">Order #{order.id}</h6>
                        <small className="text-muted">
                          {new Date(order.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <div className={`badge bg-${getStatusColor(order.status)} px-3 py-2 rounded-pill`}>
                        {getStatusIcon(order.status)} {order.status}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-3 mt-3">
                      <img
                        src={order.image_url || "https://via.placeholder.com/80"}
                        alt={order.product_name}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "12px"
                        }}
                      />
                      <div className="flex-grow-1">
                        <p className="fw-bold mb-1">{order.product_name}</p>
                        <p className="mb-1">Quantity: {order.quantity}</p>
                        <p className="text-primary fw-bold mb-0">
                          ₦{order.total_amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2 border-top">
                      <button 
                        className="btn btn-sm btn-outline-primary w-100"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        <FaEye className="me-1" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Orders;