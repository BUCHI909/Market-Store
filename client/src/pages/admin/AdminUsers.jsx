// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FaSearch, FaEye, FaEdit, FaBan, FaCheck, FaTrash, FaUserTag } from 'react-icons/fa';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, roleFilter, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.currentPage,
          limit: 10,
          search: search,
          role: roleFilter
        }
      });
      
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'danger',
      seller: 'success',
      user: 'secondary'
    };
    return <Badge bg={colors[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <div>
      <h2 className="mb-4">User Management</h2>
      
      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-3">
              <InputGroup style={{ maxWidth: '400px' }}>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              
              <Form.Select 
                style={{ maxWidth: '200px' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="seller">Sellers</option>
                <option value="user">Users</option>
              </Form.Select>
              
              <Button type="submit" variant="primary">Apply Filters</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Stores</th>
                <th>Orders</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '40px',
                        background: '#667eea20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <div>{user.name}</div>
                        <small className="text-muted">ID: {user.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{user.email}</div>
                    <small>{user.phone}</small>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{user.store_count}</td>
                  <td>{user.order_count}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="link" size="sm" title="View">
                        <FaEye />
                      </Button>
                      <Button variant="link" size="sm" title="Change Role">
                        <FaUserTag />
                      </Button>
                      <Button variant="link" size="sm" title="Suspend" className="text-warning">
                        <FaBan />
                      </Button>
                      <Button variant="link" size="sm" title="Delete" className="text-danger">
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  onClick={() => setPagination({ 
                    ...pagination, 
                    currentPage: pagination.currentPage - 1 
                  })}
                  disabled={pagination.currentPage === 1}
                />
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === pagination.currentPage}
                    onClick={() => setPagination({ 
                      ...pagination, 
                      currentPage: i + 1 
                    })}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  onClick={() => setPagination({ 
                    ...pagination, 
                    currentPage: pagination.currentPage + 1 
                  })}
                  disabled={pagination.currentPage === pagination.totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminUsers;