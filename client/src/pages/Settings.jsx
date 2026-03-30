// src/pages/Settings.jsx - OPTIMIZED FOR FAST LOADING
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getFullProfile,
  updateProfileSettings,
  uploadAvatar,
  updatePassword,
  updateStoreSettings,
  updateNotificationSettings,
  updateAppearanceSettings,
  deleteAccount,
} from "../utils/api.js";
import { Form, Button, Alert, Spinner, Row, Col, Card, Modal, Badge } from "react-bootstrap";
import {
  FaUser, FaStore, FaLock, FaBell, FaPalette, FaGlobe, FaSave, FaKey,
  FaCamera, FaExclamationTriangle, FaMoon, FaSun, FaTrash, FaShieldAlt,
  FaEye, FaEyeSlash, FaPhone, FaMapMarkerAlt, FaGlobe as FaWebsite,
  FaInfoCircle, FaCheckCircle, FaShoppingBag, FaDollarSign, FaClock,
  FaTruck, FaUndo, FaEnvelope, FaDesktop, FaLanguage, FaCheckDouble,
  FaPercent, FaFileInvoice, FaClipboardList, FaCog, FaTag, FaArrowLeft
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, hasLower: false, hasUpper: false, hasNumber: false, hasSpecial: false, minLength: false });

  // Form States
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "", bio: "", location: "", website: "", avatar: null });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [storeData, setStoreData] = useState({ storeName: "", storeDescription: "", storeEmail: "", storePhone: "", storeAddress: "", currency: "₦", timezone: "Africa/Lagos", taxRate: "", shippingPolicy: "", returnPolicy: "" });
  const [notifications, setNotifications] = useState({ emailNotifications: true, orderUpdates: true, promotions: false, securityAlerts: true, weeklyReports: true, marketingEmails: false });
  const [appearance, setAppearance] = useState({ theme: "light", compactMode: false, animations: true, fontSize: "medium" });

  useEffect(() => {
    fetchAllSettings();
    window.scrollTo(0, 0);
  }, []);

  const fetchAllSettings = async () => {
    setFetching(true);
    try {
      const profileRes = await getFullProfile();
      setProfileData({
        name: profileRes.data.user.name || "",
        email: profileRes.data.user.email || "",
        phone: profileRes.data.user.phone || "",
        bio: profileRes.data.user.bio || "",
        location: profileRes.data.user.location || "",
        website: profileRes.data.user.website || "",
        avatar: profileRes.data.user.avatar || null,
      });
      setAvatarPreview(profileRes.data.user.avatar ? `http://localhost:5000${profileRes.data.user.avatar}` : null);
      
      if (profileRes.data.notifications) {
        setNotifications({
          emailNotifications: profileRes.data.notifications.email_notifications,
          orderUpdates: profileRes.data.notifications.order_updates,
          promotions: profileRes.data.notifications.promotions,
          securityAlerts: profileRes.data.notifications.security_alerts,
          weeklyReports: profileRes.data.notifications.weekly_reports,
          marketingEmails: profileRes.data.notifications.marketing_emails,
        });
      }
      if (profileRes.data.appearance) {
        setAppearance({
          theme: profileRes.data.appearance.theme,
          compactMode: profileRes.data.appearance.compact_mode,
          animations: profileRes.data.appearance.animations,
          fontSize: profileRes.data.appearance.font_size,
        });
      }
      if (profileRes.data.store) {
        setStoreData({
          storeName: profileRes.data.store.store_name || "",
          storeDescription: profileRes.data.store.store_description || "",
          storeEmail: profileRes.data.store.store_email || "",
          storePhone: profileRes.data.store.store_phone || "",
          storeAddress: profileRes.data.store.store_address || "",
          currency: profileRes.data.store.currency || "₦",
          timezone: profileRes.data.store.timezone || "Africa/Lagos",
          taxRate: profileRes.data.store.tax_rate || "",
          shippingPolicy: profileRes.data.store.shipping_policy || "",
          returnPolicy: profileRes.data.store.return_policy || "",
        });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      showMessage("danger", "Failed to load settings");
    } finally {
      setFetching(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const checkPasswordStrength = (password) => {
    const strength = {
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 8,
    };
    const score = Object.values(strength).filter(Boolean).length;
    setPasswordStrength({ ...strength, score });
  };

  const getPasswordStrengthText = () => {
    const { score } = passwordStrength;
    if (score <= 2) return { text: "Weak", color: "#dc3545" };
    if (score <= 4) return { text: "Medium", color: "#ffc107" };
    return { text: "Strong", color: "#28a745" };
  };

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (name === "newPassword") checkPasswordStrength(value);
  };
  const handleNotificationChange = (e) => setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  const handleAppearanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearance({ ...appearance, [name]: type === "checkbox" ? checked : value });
  };
  const handleStoreChange = (e) => setStoreData({ ...storeData, [e.target.name]: e.target.value });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await uploadAvatar(formData);
      setProfileData({ ...profileData, avatar: res.data.avatar });
      showMessage("success", "Avatar uploaded!");
    } catch (err) {
      showMessage("danger", "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfileSettings(profileData);
      setUser({ ...user, ...res.data.user });
      showMessage("success", "Profile updated!");
    } catch (err) {
      showMessage("danger", err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage("danger", "Passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showMessage("danger", "Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await updatePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      showMessage("success", "Password updated!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMessage("danger", err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStoreSettings(storeData);
      showMessage("success", "Store settings saved!");
    } catch (err) {
      showMessage("danger", "Failed to save store settings");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSubmit = async () => {
    setLoading(true);
    try {
      await updateNotificationSettings(notifications);
      showMessage("success", "Notification preferences saved!");
    } catch (err) {
      showMessage("danger", "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleAppearanceSubmit = async () => {
    setLoading(true);
    try {
      await updateAppearanceSettings(appearance);
      if (appearance.theme === "dark") document.body.classList.add("dark-mode");
      else document.body.classList.remove("dark-mode");
      showMessage("success", "Appearance settings saved!");
    } catch (err) {
      showMessage("danger", "Failed to save appearance");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      showMessage("danger", "Please enter your password");
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword);
      logout();
      navigate("/login");
    } catch (err) {
      showMessage("danger", err.response?.data?.message || "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <FaUser />, desc: "Manage your personal information" },
    { id: "store", label: "Store", icon: <FaStore />, desc: "Configure your store settings" },
    { id: "security", label: "Security", icon: <FaLock />, desc: "Password and account security" },
    { id: "notifications", label: "Notifications", icon: <FaBell />, desc: "Choose what to be notified about" },
    { id: "appearance", label: "Appearance", icon: <FaPalette />, desc: "Customize how MarketSphere looks" },
  ];

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary rounded-circle p-2">
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="fw-bold mb-0">Settings</h2>
          <p className="text-muted">Manage your account preferences</p>
        </div>
      </div>

      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: "", text: "" })} className="mb-4">
          {message.text}
        </Alert>
      )}

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap border-bottom pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-light'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4"><FaUser className="me-2" /> Profile Information</h5>
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img src={avatarPreview || `https://ui-avatars.com/api/?name=${profileData.name}&background=667eea&color=fff&size=100`} alt="Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
                <label htmlFor="avatar-upload" className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2" style={{ cursor: "pointer" }}>
                  {uploadingAvatar ? <Spinner size="sm" /> : <FaCamera size={14} color="white" />}
                  <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                </label>
              </div>
            </div>
            <Form onSubmit={handleProfileSubmit}>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control name="name" value={profileData.name} onChange={handleProfileChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control name="email" type="email" value={profileData.email} onChange={handleProfileChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Phone</Form.Label><Form.Control name="phone" value={profileData.phone} onChange={handleProfileChange} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Location</Form.Label><Form.Control name="location" value={profileData.location} onChange={handleProfileChange} /></Form.Group></Col>
                <Col md={12}><Form.Group className="mb-3"><Form.Label>Website</Form.Label><Form.Control name="website" value={profileData.website} onChange={handleProfileChange} /></Form.Group></Col>
                <Col md={12}><Form.Group className="mb-3"><Form.Label>Bio</Form.Label><Form.Control as="textarea" rows={3} name="bio" value={profileData.bio} onChange={handleProfileChange} /></Form.Group></Col>
              </Row>
              <Button type="submit" disabled={loading} className="w-100">{loading ? <Spinner size="sm" /> : <FaSave className="me-2" />} Save Changes</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Store Tab */}
      {activeTab === "store" && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4"><FaStore className="me-2" /> Store Settings</h5>
            <Form onSubmit={handleStoreSubmit}>
              <Form.Group className="mb-3"><Form.Label>Store Name</Form.Label><Form.Control name="storeName" value={storeData.storeName} onChange={handleStoreChange} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Store Description</Form.Label><Form.Control as="textarea" rows={3} name="storeDescription" value={storeData.storeDescription} onChange={handleStoreChange} /></Form.Group>
              <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Store Email</Form.Label><Form.Control name="storeEmail" value={storeData.storeEmail} onChange={handleStoreChange} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Store Phone</Form.Label><Form.Control name="storePhone" value={storeData.storePhone} onChange={handleStoreChange} /></Form.Group></Col></Row>
              <Form.Group className="mb-3"><Form.Label>Store Address</Form.Label><Form.Control name="storeAddress" value={storeData.storeAddress} onChange={handleStoreChange} /></Form.Group>
              <Row><Col md={4}><Form.Group className="mb-3"><Form.Label>Currency</Form.Label><Form.Select name="currency" value={storeData.currency} onChange={handleStoreChange}><option>₦ NGN</option><option>$ USD</option><option>€ EUR</option></Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Timezone</Form.Label><Form.Select name="timezone" value={storeData.timezone} onChange={handleStoreChange}><option>Africa/Lagos</option><option>America/New_York</option><option>Europe/London</option></Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Tax Rate (%)</Form.Label><Form.Control type="number" name="taxRate" value={storeData.taxRate} onChange={handleStoreChange} /></Form.Group></Col></Row>
              <Form.Group className="mb-3"><Form.Label>Shipping Policy</Form.Label><Form.Control as="textarea" rows={2} name="shippingPolicy" value={storeData.shippingPolicy} onChange={handleStoreChange} /></Form.Group>
              <Form.Group className="mb-4"><Form.Label>Return Policy</Form.Label><Form.Control as="textarea" rows={2} name="returnPolicy" value={storeData.returnPolicy} onChange={handleStoreChange} /></Form.Group>
              <Button type="submit" disabled={loading} className="w-100">{loading ? <Spinner size="sm" /> : <FaSave className="me-2" />} Save Store Settings</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4"><FaLock className="me-2" /> Security Settings</h5>
            <Form onSubmit={handlePasswordSubmit}>
              <Form.Group className="mb-3"><Form.Label>Current Password</Form.Label><Form.Control type={showPassword.current ? "text" : "password"} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                <span className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ cursor: "pointer" }} onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>{showPassword.current ? <FaEyeSlash /> : <FaEye />}</span></Form.Group>
              <Form.Group className="mb-3"><Form.Label>New Password</Form.Label><Form.Control type={showPassword.new ? "text" : "password"} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                <span className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ cursor: "pointer" }} onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>{showPassword.new ? <FaEyeSlash /> : <FaEye />}</span>
                {passwordData.newPassword && (<div className="mt-2"><div className="d-flex gap-1 mb-1">{[...Array(5)].map((_, i) => (<div key={i} style={{ height: "4px", flex: 1, borderRadius: "2px", background: i < passwordStrength.score ? getPasswordStrengthText().color : "#e0e0e0" }} />))}</div><small style={{ color: getPasswordStrengthText().color }}>{getPasswordStrengthText().text}</small></div>)}</Form.Group>
              <Form.Group className="mb-4"><Form.Label>Confirm Password</Form.Label><Form.Control type={showPassword.confirm ? "text" : "password"} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required /></Form.Group>
              <div className="bg-light p-3 rounded-3 mb-4"><div className="d-flex gap-2 mb-2"><FaShieldAlt /><h6 className="mb-0">Two-Factor Authentication</h6></div><p className="text-muted small mb-2">Add extra security to your account</p><Button variant="outline-primary" size="sm" disabled>Coming Soon</Button></div>
              <Button type="submit" disabled={loading} className="w-100 mb-3">{loading ? <Spinner size="sm" /> : <FaKey className="me-2" />} Change Password</Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)} className="w-100"><FaTrash className="me-2" /> Delete Account</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4"><FaBell className="me-2" /> Notification Preferences</h5>
            {Object.entries({ emailNotifications: "Email Notifications", orderUpdates: "Order Updates", promotions: "Promotions", securityAlerts: "Security Alerts", weeklyReports: "Weekly Reports", marketingEmails: "Marketing Emails" }).map(([key, label]) => (
              <div key={key} className="d-flex justify-content-between align-items-center p-3 mb-2 bg-light rounded-3"><span>{label}</span><Form.Check type="switch" name={key} checked={notifications[key]} onChange={handleNotificationChange} /></div>
            ))}
            <Button onClick={handleNotificationsSubmit} disabled={loading} className="w-100">{loading ? <Spinner size="sm" /> : <FaSave className="me-2" />} Save Preferences</Button>
          </Card.Body>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4"><FaPalette className="me-2" /> Appearance Settings</h5>
            <div className="mb-4"><h6>Theme</h6><div className="d-flex gap-3">{["light", "dark", "system"].map(theme => (<button key={theme} onClick={() => setAppearance({ ...appearance, theme })} className={`btn flex-1 ${appearance.theme === theme ? 'btn-primary' : 'btn-light'}`}>{theme === "light" ? <FaSun /> : theme === "dark" ? <FaMoon /> : <FaDesktop />} {theme}</button>))}</div></div>
            <div className="mb-4"><h6>Font Size</h6><div className="d-flex gap-3">{["small", "medium", "large"].map(size => (<button key={size} onClick={() => setAppearance({ ...appearance, fontSize: size })} className={`btn flex-1 ${appearance.fontSize === size ? 'btn-primary' : 'btn-light'}`}>{size}</button>))}</div></div>
            <div className="mb-4"><div className="d-flex justify-content-between p-3 bg-light rounded-3 mb-2"><span>Compact Mode</span><Form.Check type="switch" name="compactMode" checked={appearance.compactMode} onChange={handleAppearanceChange} /></div>
            <div className="d-flex justify-content-between p-3 bg-light rounded-3"><span>Enable Animations</span><Form.Check type="switch" name="animations" checked={appearance.animations} onChange={handleAppearanceChange} /></div></div>
            <Button onClick={handleAppearanceSubmit} disabled={loading} className="w-100">{loading ? <Spinner size="sm" /> : <FaSave className="me-2" />} Save Appearance</Button>
          </Card.Body>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title className="text-danger"><FaExclamationTriangle /> Delete Account</Modal.Title></Modal.Header>
        <Modal.Body className="text-center"><p>Are you sure? This action cannot be undone.</p><Form.Control type="password" placeholder="Enter password to confirm" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} /></Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button><Button variant="danger" onClick={handleDeleteAccount} disabled={deleteLoading}>{deleteLoading ? <Spinner size="sm" /> : "Delete Account"}</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;