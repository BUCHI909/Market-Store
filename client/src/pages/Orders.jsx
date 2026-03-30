// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { getOrders } from "../utils/api";
import { Table, Badge } from "react-bootstrap";
import { FaTruck, FaCalendarAlt } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status?.toLowerCase()] || 'secondary';
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Orders</h2>
      <Table responsive hover className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Status</th>
            <th>Total</th>
            <th>Order Date</th>
            <th>Est. Delivery</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td className="fw-bold">#{order.id}</td>
              <td>{order.product_name || order.product}</td>
              <td>
                <Badge bg={getStatusBadge(order.status)}>
                  {order.status || 'Pending'}
                </Badge>
              </td>
              <td>₦{order.total_amount?.toLocaleString() || order.price?.toLocaleString() || 0}</td>
              <td><FaCalendarAlt className="me-1" />{new Date(order.created_at).toLocaleDateString()}</td>
              <td><FaTruck className="me-1" />{getEstimatedDelivery(order.created_at)}</td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-5">No orders yet</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Orders;