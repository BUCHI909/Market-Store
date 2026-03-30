// src/pages/Profile.jsx - OPTIMIZED FOR FAST LOADING
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getProfile, updateProfilePicture, getOrders, getReviews } from "../utils/api";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaShoppingCart, FaStar, FaStore, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaTrophy, FaCamera, FaSpinner, FaEdit, FaSave, FaTimes, FaUser, FaGlobe, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Card, Alert, Spinner, Row, Col, Modal, Badge } from "react-bootstrap";
import axios from "axios";

const Profile = () => {
  const { user: authUser, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", bio: "", location: "", website: ""
  });

  // Memoized stats for performance
  const stats = useMemo(() => ({
    totalOrders: Array.isArray(orders) ? orders.length : 0,
    totalSpent: Array.isArray(orders) ? orders.reduce((acc, o) => acc + (o.total_amount || 0), 0) : 0,
    averageRating: Array.isArray(reviews) && reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1) : 0,
    completedOrders: Array.isArray(orders) ? orders.filter(o => o.status === 'completed' || o.status === 'delivered').length : 0
  }), [orders, reviews]);

  // Fetch all data in parallel for speed
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [profileRes, ordersRes, reviewsRes] = await Promise.allSettled([
          getProfile(),
          getOrders(),
          getReviews()
        ]);

        if (profileRes.status === 'fulfilled') {
          const userData = profileRes.value.data?.user || profileRes.value.data;
          setProfile(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bio: userData.bio || "",
            location: userData.location || "",
            website: userData.website || ""
          });
          if (userData.avatar) {
            setAvatarPreview(userData.avatar.startsWith('http') ? userData.avatar : `http://localhost:5000${userData.avatar}`);
          }
        }

        if (ordersRes.status === 'fulfilled') {
          setOrders(Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []);
        }

        if (reviewsRes.status === 'fulfilled') {
          setReviews(Array.isArray(reviewsRes.value.data) ? reviewsRes.value.data : []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        showMessage("danger", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    
    const formData = new FormData();
    formData.append("avatar", file);
    
    try {
      const res = await updateProfilePicture(formData);
      showMessage("success", "Avatar updated!");
      setUser(prev => ({ ...prev, avatar: res.data.profilePicture }));
    } catch (err) {
      showMessage("danger", "Failed to update avatar");
      setAvatarPreview(profile?.avatar);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put("/api/auth/update-profile", formData);
      setUser(prev => ({ ...prev, ...res.data.user }));
      setProfile(prev => ({ ...prev, ...res.data.user }));
      showMessage("success", "Profile updated!");
      setEditMode(false);
    } catch (err) {
      showMessage("danger", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid px-4">
      {/* Success/Error Toast */}
      {message.text && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
          <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })}>
            {message.text}
          </Alert>
        </div>
      )}

      {/* Profile Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden mb-4" style={{ borderRadius: "20px" }}>
        <div style={{
          height: "120px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            bottom: "-50px",
            left: "30px",
            display: "flex",
            alignItems: "flex-end",
            gap: "20px"
          }}>
            {/* Avatar */}
            <div className="position-relative">
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "4px solid white",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                overflow: "hidden",
                background: "white"
              }}>
                {uploadingAvatar ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <Spinner size="sm" />
                  </div>
                ) : avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                    <FaUserCircle size={70} className="text-primary" />
                  </div>
                )}
              </div>
              <label htmlFor="avatar-upload" style={{
                position: "absolute", bottom: "5px", right: "5px",
                background: "#667eea", width: "32px", height: "32px",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", border: "2px solid white"
              }}>
                <FaCamera size={14} color="white" />
                <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
              </label>
            </div>

            {/* Name & Role */}
            <div style={{ marginBottom: "15px" }}>
              <h2 className="fw-bold text-white mb-1">{profile?.name || authUser?.name}</h2>
              <div className="d-flex gap-2">
                <Badge bg="light" text="dark" className="px-3 py-2">
                  <FaStore className="me-1" /> {profile?.role === 'seller' ? 'Seller' : 'Buyer'}
                </Badge>
                <Badge bg="success" className="px-3 py-2">
                  <FaCheckCircle className="me-1" /> Verified
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Card.Body className="pt-5 px-4 pb-4">
          {/* Quick Stats Row */}
          <Row className="g-3 mb-4">
            <Col xs={6} md={3}>
              <div className="bg-light p-3 rounded-3 text-center">
                <FaShoppingCart size={20} className="text-primary mb-1" />
                <h5 className="fw-bold mb-0">{stats.totalOrders}</h5>
                <small>Total Orders</small>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-light p-3 rounded-3 text-center">
                <FaStar size={20} className="text-warning mb-1" />
                <h5 className="fw-bold mb-0">{stats.averageRating}</h5>
                <small>Avg Rating</small>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-light p-3 rounded-3 text-center">
                <FaCheckCircle size={20} className="text-success mb-1" />
                <h5 className="fw-bold mb-0">{stats.completedOrders}</h5>
                <small>Completed</small>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="bg-light p-3 rounded-3 text-center">
                <FaCalendarAlt size={20} className="text-info mb-1" />
                <h5 className="fw-bold mb-0">{formatDate(profile?.created_at)}</h5>
                <small>Member Since</small>
              </div>
            </Col>
          </Row>

          {/* Profile Info Section */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Profile Information</h5>
            {!editMode ? (
              <Button variant="outline-primary" size="sm" onClick={() => setEditMode(true)}>
                <FaEdit className="me-1" /> Edit
              </Button>
            ) : (
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm" onClick={() => setEditMode(false)}>
                  <FaTimes className="me-1" /> Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? <Spinner size="sm" /> : <FaSave className="me-1" />} Save
                </Button>
              </div>
            )}
          </div>

          {editMode ? (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaUser className="me-1" /> Full Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaEnvelope className="me-1" /> Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaPhone className="me-1" /> Phone</Form.Label>
                    <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaMapMarkerAlt className="me-1" /> Location</Form.Label>
                    <Form.Control type="text" name="location" value={formData.location} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaGlobe className="me-1" /> Website</Form.Label>
                    <Form.Control type="url" name="website" value={formData.website} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaInfoCircle className="me-1" /> Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          ) : (
            <div className="bg-light p-3 rounded-3">
              <Row>
                <Col md={6} className="mb-2">
                  <small className="text-muted d-block">Full Name</small>
                  <strong>{profile?.name || authUser?.name}</strong>
                </Col>
                <Col md={6} className="mb-2">
                  <small className="text-muted d-block">Email</small>
                  <strong>{profile?.email || authUser?.email}</strong>
                </Col>
                <Col md={6} className="mb-2">
                  <small className="text-muted d-block">Phone</small>
                  <strong>{profile?.phone || "Not provided"}</strong>
                </Col>
                <Col md={6} className="mb-2">
                  <small className="text-muted d-block">Location</small>
                  <strong>{profile?.location || "Not provided"}</strong>
                </Col>
                <Col md={12} className="mb-2">
                  <small className="text-muted d-block">Website</small>
                  <strong>{profile?.website || "Not provided"}</strong>
                </Col>
                <Col md={12}>
                  <small className="text-muted d-block">Bio</small>
                  <p className="mb-0">{profile?.bio || "No bio added yet."}</p>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Orders Section */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "16px" }}>
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3"><FaShoppingCart className="me-2" /> Recent Orders</h5>
          {stats.totalOrders === 0 ? (
            <div className="text-center py-4">
              <FaShoppingCart size={40} className="text-muted mb-2" />
              <p className="text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr><th>Order ID</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td className="fw-bold">#{order.id}</td>
                      <td>₦{(order.total_amount || 0).toLocaleString()}</td>
                      <td><Badge bg={order.status === 'completed' ? 'success' : 'warning'}>{order.status}</Badge></td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Reviews Section */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3"><FaStar className="me-2 text-warning" /> Customer Reviews</h5>
          {reviews.length === 0 ? (
            <div className="text-center py-4">
              <FaStar size={40} className="text-muted mb-2" />
              <p className="text-muted">No reviews yet</p>
            </div>
          ) : (
            reviews.slice(0, 3).map(review => (
              <div key={review.id} className="border-bottom pb-3 mb-3">
                <div className="d-flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < review.rating ? "#fbbf24" : "#e2e8f0"} size={14} />
                  ))}
                </div>
                <p className="mb-1">{review.comment}</p>
                <small className="text-muted">- {review.user_name} • {new Date(review.created_at).toLocaleDateString()}</small>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;