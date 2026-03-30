// src/pages/admin/AdminStores.jsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FaSearch, FaEye, FaCheck, FaTimes, FaBan } from 'react-icons/fa';
import axios from 'axios';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    fetchStores();
  }, [pagination.currentPage, statusFilter, search]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/stores', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.currentPage,
          limit: 10,
          search: search,
          status: statusFilter
        }
      });
      
      setStores(response.data.stores);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storeId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/admin/stores/${storeId}/status`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStores();
    } catch (error) {
      console.error('Error approving store:', error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      rejected: 'danger',
      suspended: 'secondary'
    };
    return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div>
      <h2 className="mb-4">Store Management</h2>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex gap-3">
            <InputGroup style={{ maxWidth: '400px' }}>
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Search stores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            
            <Form.Select 
              style={{ maxWidth: '200px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
            
            <Button onClick={fetchStores} variant="primary">Apply</Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Store</th>
                <th>Owner</th>
                <th>Products</th>
                <th>Sales</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>
                    <div className="fw-bold">{store.store_name}</div>
                    <small className="text-muted">{store.currency}</small>
                  </td>
                  <td>
                    <div>{store.owner_name}</div>
                    <small>{store.owner_email}</small>
                  </td>
                  <td>{store.product_count}</td>
                  <td>₦{store.total_sales?.toLocaleString()}</td>
                  <td>{getStatusBadge(store.status)}</td>
                  <td>{new Date(store.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="link" size="sm">
                        <FaEye />
                      </Button>
                      {store.status === 'pending' && (
                        <>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-success"
                            onClick={() => handleApprove(store.id)}
                          >
                            <FaCheck />
                          </Button>
                          <Button variant="link" size="sm" className="text-danger">
                            <FaTimes />
                          </Button>
                        </>
                      )}
                      <Button variant="link" size="sm" className="text-warning">
                        <FaBan />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminStores;