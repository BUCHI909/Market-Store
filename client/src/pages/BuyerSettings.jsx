// src/pages/BuyerSettings.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updatePassword } from "../utils/api";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { FaLock, FaBell, FaGlobe, FaLanguage, FaMoon, FaSave, FaEye, FaEyeSlash, FaEnvelope, FaMobileAlt } from "react-icons/fa";

const BuyerSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("password");
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailOrders: true, emailPromos: false, smsAlerts: true, pushNotifications: true
  });
  
  // Preferences
  const [preferences, setPreferences] = useState({
    language: "en", currency: "NGN", theme: "light", timezone: "Africa/Lagos"
  });

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handlePreferenceChange = (e) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "danger", text: "Passwords do not match!" });
      return;
    }
    
    setLoading(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: "success", text: "Password updated!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "danger", text: "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSubmit = () => {
    setMessage({ type: "success", text: "Notification preferences saved!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handlePreferencesSubmit = () => {
    setMessage({ type: "success", text: "Preferences saved!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
      <Card.Body className="p-4">
        <h3 className="fw-bold mb-4">Settings</h3>
        
        {message.text && (
          <Alert variant={message.type} className="mb-3" dismissible onClose={() => setMessage({ type: "", text: "" })}>
            {message.text}
          </Alert>
        )}

        {/* Tab Navigation */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2">
          <Button variant={activeTab === "password" ? "primary" : "light"} size="sm" onClick={() => setActiveTab("password")}>
            <FaLock className="me-1" /> Security
          </Button>
          <Button variant={activeTab === "notifications" ? "primary" : "light"} size="sm" onClick={() => setActiveTab("notifications")}>
            <FaBell className="me-1" /> Notifications
          </Button>
          <Button variant={activeTab === "preferences" ? "primary" : "light"} size="sm" onClick={() => setActiveTab("preferences")}>
            <FaGlobe className="me-1" /> Preferences
          </Button>
        </div>

        {/* Password Tab */}
        {activeTab === "password" && (
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <div className="position-relative">
                <Form.Control type={showPassword ? "text" : "password"} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
            </Form.Group>
            
            <Button type="submit" disabled={loading} className="w-100">
              {loading ? <Spinner size="sm" /> : "Update Password"}
            </Button>
          </Form>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div>
            <div className="mb-3 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div><FaEnvelope className="me-2" /> Email for Orders</div>
                <Form.Check type="switch" name="emailOrders" checked={notifications.emailOrders} onChange={handleNotificationChange} />
              </div>
            </div>
            <div className="mb-3 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div><FaEnvelope className="me-2" /> Promotional Emails</div>
                <Form.Check type="switch" name="emailPromos" checked={notifications.emailPromos} onChange={handleNotificationChange} />
              </div>
            </div>
            <div className="mb-3 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div><FaMobileAlt className="me-2" /> SMS Alerts</div>
                <Form.Check type="switch" name="smsAlerts" checked={notifications.smsAlerts} onChange={handleNotificationChange} />
              </div>
            </div>
            <div className="mb-4 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div><FaBell className="me-2" /> Push Notifications</div>
                <Form.Check type="switch" name="pushNotifications" checked={notifications.pushNotifications} onChange={handleNotificationChange} />
              </div>
            </div>
            <Button variant="primary" onClick={handleNotificationsSubmit}>Save Preferences</Button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div>
            <Form.Group className="mb-3">
              <Form.Label><FaLanguage className="me-2" /> Language</Form.Label>
              <Form.Select name="language" value={preferences.language} onChange={handlePreferenceChange}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ar">Arabic</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label><FaGlobe className="me-2" /> Currency</Form.Label>
              <Form.Select name="currency" value={preferences.currency} onChange={handlePreferenceChange}>
                <option value="NGN">₦ NGN</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label><FaMoon className="me-2" /> Theme</Form.Label>
              <Form.Select name="theme" value={preferences.theme} onChange={handlePreferenceChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label><FaGlobe className="me-2" /> Timezone</Form.Label>
              <Form.Select name="timezone" value={preferences.timezone} onChange={handlePreferenceChange}>
                <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                <option value="Africa/Cairo">Africa/Cairo (GMT+2)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
              </Form.Select>
            </Form.Group>
            
            <Button variant="primary" onClick={handlePreferencesSubmit}>Save Preferences</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BuyerSettings;