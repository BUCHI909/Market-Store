// src/pages/BuyerProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile, updateProfilePicture } from "../utils/api";
import { Form, Button, Card, Alert, Spinner, Row, Col } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaCamera, FaSave, FaAddressCard, FaCreditCard, FaHeart, FaShoppingBag } from "react-icons/fa";

const BuyerProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", bio: "", location: "", website: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Buyer-specific stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    reviewsCount: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchBuyerStats();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      const userData = res.data?.user || res.data;
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
    } catch (err) {
      console.error("Fetch profile error:", err);
      showMessage("danger", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyerStats = async () => {
    // Fetch buyer-specific stats from API
    setStats({
      totalOrders: 12,
      totalSpent: 125000,
      wishlistCount: 5,
      reviewsCount: 8
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append("avatar", file);
    
    try {
      const res = await updateProfilePicture(formData);
      showMessage("success", "Avatar updated!");
      setUser({ ...user, avatar: res.data.profilePicture });
    } catch (err) {
      showMessage("danger", "Failed to update avatar");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      setUser({ ...user, ...res.data.user });
      showMessage("success", "Profile updated!");
    } catch (err) {
      showMessage("danger", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
      <Card.Body className="p-4">
        <h3 className="fw-bold mb-4">My Profile</h3>
        
        {message.text && (
          <Alert variant={message.type} className="mb-3" dismissible onClose={() => setMessage({ type: "", text: "" })}>
            {message.text}
          </Alert>
        )}

        {/* Stats Cards - Buyer Specific */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <div className="bg-light p-3 rounded-3 text-center">
              <FaShoppingBag size={24} className="text-primary mb-2" />
              <h5 className="fw-bold mb-0">{stats.totalOrders}</h5>
              <small className="text-muted">Orders</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="bg-light p-3 rounded-3 text-center">
              <FaCreditCard size={24} className="text-success mb-2" />
              <h5 className="fw-bold mb-0">₦{stats.totalSpent.toLocaleString()}</h5>
              <small className="text-muted">Total Spent</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="bg-light p-3 rounded-3 text-center">
              <FaHeart size={24} className="text-danger mb-2" />
              <h5 className="fw-bold mb-0">{stats.wishlistCount}</h5>
              <small className="text-muted">Wishlist</small>
            </div>
          </Col>
          <Col md={3}>
            <div className="bg-light p-3 rounded-3 text-center">
              <FaStar size={24} className="text-warning mb-2" />
              <h5 className="fw-bold mb-0">{stats.reviewsCount}</h5>
              <small className="text-muted">Reviews</small>
            </div>
          </Col>
        </Row>

        {/* Avatar Section */}
        <div className="text-center mb-4">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={avatarPreview || `https://ui-avatars.com/api/?name=${formData.name}&background=667eea&color=fff&size=100`}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
            <label htmlFor="avatar-upload" style={{
              position: "absolute", bottom: "0", right: "0", background: "#667eea", color: "white",
              width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", border: "2px solid white"
            }}>
              <FaCamera size={14} />
              <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><FaUser className="me-2" /> Full Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><FaEnvelope className="me-2" /> Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><FaPhone className="me-2" /> Phone</Form.Label>
                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><FaMapMarkerAlt className="me-2" /> Location</Form.Label>
                <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><FaGlobe className="me-2" /> Website</Form.Label>
                <Form.Control type="url" name="website" value={formData.website} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><FaAddressCard className="me-2" /> Default Address</Form.Label>
                <Form.Control type="text" placeholder="123 Main St, Lagos" />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-4">
            <Form.Label>Bio</Form.Label>
            <Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." />
          </Form.Group>
          
          <Button type="submit" disabled={saving} className="w-100" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}>
            {saving ? <Spinner size="sm" className="me-2" /> : <FaSave className="me-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BuyerProfile;