// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile, updateProfilePicture } from "../utils/api";
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaGlobe, FaCamera, FaSave, FaEdit } from "react-icons/fa";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: ""
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const BASE_URL = import.meta.env.VITE_API_URL || "https://market-store-2eop.onrender.com";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      const userData = res.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        location: userData.location || "",
        website: userData.website || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage({ type: "danger", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    
    try {
      setLoading(true);
      await updateProfile(formData);
      setUser(prev => ({ ...prev, ...formData }));
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: "danger", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePicture = async () => {
    if (!profilePicture) return;
    
    try {
      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      
      await updateProfilePicture(formData);
      await fetchProfile(); // Refresh profile data
      setProfilePicture(null);
      setPreviewImage(null);
      setMessage({ type: "success", text: "Profile picture updated!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("Error updating picture:", err);
      setMessage({ type: "danger", text: "Failed to update profile picture" });
    }
  };

  const getImageUrl = () => {
    if (previewImage) return previewImage;
    if (user?.avatar) {
      return user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=667eea&color=fff&size=150`;
  };

  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 24px",
        color: "white",
        borderRadius: "0 0 30px 30px"
      }}>
        <h1 className="fw-bold mb-2">My Profile</h1>
        <p className="mb-0 opacity-75">Manage your account information</p>
      </div>

      {/* Profile Content */}
      <div className="container px-3" style={{ marginTop: "-30px" }}>
        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-body p-4">
            {/* Profile Picture Section */}
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                <img
                  src={getImageUrl()}
                  alt={user?.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid white",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                  }}
                />
                <label
                  htmlFor="profilePicture"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    background: "#667eea",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                  }}
                >
                  <FaCamera color="white" size={16} />
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
              {profilePicture && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleUpdatePicture}
                    disabled={loading}
                  >
                    Save Photo
                  </button>
                </div>
              )}
            </div>

            {/* Alert Message */}
            {message.text && (
              <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
              </div>
            )}

            {/* Profile Info */}
            {!editing ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Profile Information</h5>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setEditing(true)}
                  >
                    <FaEdit className="me-1" /> Edit Profile
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <FaUser className="text-primary me-2" />
                      <strong>Name:</strong>
                      <p className="mb-0 mt-1">{user?.name || "Not set"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <FaEnvelope className="text-primary me-2" />
                      <strong>Email:</strong>
                      <p className="mb-0 mt-1">{user?.email || "Not set"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <FaPhone className="text-primary me-2" />
                      <strong>Phone:</strong>
                      <p className="mb-0 mt-1">{user?.phone || "Not set"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <FaMapMarker className="text-primary me-2" />
                      <strong>Location:</strong>
                      <p className="mb-0 mt-1">{user?.location || "Not set"}</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 bg-light rounded-3">
                      <FaGlobe className="text-primary me-2" />
                      <strong>Bio:</strong>
                      <p className="mb-0 mt-1">{user?.bio || "No bio added yet"}</p>
                    </div>
                  </div>
                  {user?.website && (
                    <div className="col-12">
                      <div className="p-3 bg-light rounded-3">
                        <FaGlobe className="text-primary me-2" />
                        <strong>Website:</strong>
                        <p className="mb-0 mt-1">
                          <a href={user.website} target="_blank" rel="noopener noreferrer">
                            {user.website}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <h5 className="fw-bold mb-3">Edit Profile</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Bio</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    rows="3"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Website (Optional)</label>
                  <input
                    type="url"
                    name="website"
                    className="form-control"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        bio: user?.bio || "",
                        location: user?.location || "",
                        website: user?.website || ""
                      });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <FaSave className="me-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;