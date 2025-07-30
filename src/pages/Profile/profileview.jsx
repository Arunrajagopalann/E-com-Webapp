// SimpleProfileView.js
import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import "./Profile.css";

const SimpleProfileView = () => {
  const API_BASE = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem("accessToken");
  const { showToast } = useToast();
      const id = localStorage.getItem("UserId");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPasswordId, setEditingPasswordId] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch all user profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.statusCode === 200) {
          setProfiles(data.data);
        } else {
          setError(data.message || "Failed to fetch profiles");
        //   showToast(data.message || "Failed to fetch profiles", "danger");
        }
      } catch (error) {
        setError("Error fetching profiles. Please try again.");
        // showToast("Error fetching profiles", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
   

    try {
      const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await response.json();
      if (data.statusCode === 200) {
        showToast("Password updated successfully", "success");
        setEditingPasswordId(null);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(data.message || "Failed to update password", "danger");
      }
    } catch (error) {
      showToast("An error occurred while updating password", "danger");
    }
  };

  // Cancel password edit
  const handleCancelPasswordEdit = () => {
    setEditingPasswordId(null);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Start editing password
  const handleEditPassword = (userId) => {
    setEditingPasswordId(userId);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (loading) {
    return (
      <div className="simple-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="simple-profile-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-profile-container">
      <div className="profile-header">
        <h1>User Profiles</h1>
        <p>Manage user accounts and passwords</p>
      </div>

      <div className="profiles-grid">
        {profiles.length === 0 ? (
          <div className="no-profiles">
            <p>No user profiles found</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <div key={profile._id} className="profile-card">
              <div className="profile-avatar">
                {profile.name?.charAt(0).toUpperCase() || "U"}
              </div>
              
              <div className="profile-info">
                <h3 className="profile-name">{profile.name}</h3>
                <p className="profile-email">{profile.email}</p>
                <div className="profile-details">
                  <span className="detail-item">
                    <strong>Role:</strong> {profile.role}
                  </span>
                  {profile.phone && (
                    <span className="detail-item">
                      <strong>Phone:</strong> {profile.phone}
                    </span>
                  )}
                  <span className="detail-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${(profile.status || 'active').toLowerCase()}`}>
                      {profile.status || 'Active'}
                    </span>
                  </span>
                  <span className="detail-item">
                    <strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="profile-actions">
                {editingPasswordId === profile._id ? (
                  <form onSubmit={handlePasswordSubmit} className="password-form">
                    <h4>Change Password</h4>
                    
                    <div className="form-group">
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-success btn-sm">
                        Update Password
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancelPasswordEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleEditPassword(profile._id)}
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimpleProfileView;