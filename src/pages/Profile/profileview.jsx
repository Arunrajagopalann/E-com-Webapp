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
  const [viewDetail, setViewDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
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
          // If data.data is an array, use it directly. If it's an object, wrap it in an array
          const profileData = Array.isArray(data.data)
            ? data.data
            : [data.data];
          setProfiles(profileData);
          setEditForm(profileData[0] || {}); // Initialize edit form with first profile
        } else {
          setError(data.message || "Failed to fetch profile");
          showToast(data.message || "Failed to fetch profile", "danger",()=>{});
        }
      } catch (error) {
        setError("Error fetching profile. Please try again.");
        showToast("Error fetching profile", "danger",()=>{});
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE, accessToken, id, showToast]);

  // Handle name change only
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit profile changes (name only)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
        }),
      });

      const data = await response.json();
      if (data.statusCode === 200) {
        // Update the profiles state with new data
        setProfiles([data.data]);
        showToast("Name updated successfully", "success",()=>{});
        setEditMode(false);
      } else {
        showToast(data.message || "Failed to update name", "danger",()=>{});
      }
    } catch (error) {
      showToast("Error updating name", "danger",()=>{});
    }
  };

  if (loading) {
    return (
      <div className="simple-profile-container">
        <div className="loading">Loading profile data...</div>
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

  if (profiles.length === 0) {
    return (
      <div className="simple-profile-container">
        <div className="no-profiles">
          <p>No profile found</p>
        </div>
      </div>
    );
  }

  // Get first profile (since we're dealing with a single user)
  const profile = profiles[0];

  return (
    <div className="simple-profile-container">
      <div className="profile-header">
        <h1>{viewDetail ? "Profile Details" : "My Profile"}</h1>
        {!viewDetail && (
          <button
            className="btn btn-primary"
            onClick={() => setViewDetail(true)}
          >
            View Details
          </button>
        )}
      </div>

      {!viewDetail ? (
        // Simple profile view
        <div className="profiles-grid">
          <div className="profile-card">
            <div className="profile-avatar">
              {profile.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="profile-info">
              <h3
                className="profile-name clickable"
                onClick={() => setViewDetail(true)}
              >
                {profile.name}
              </h3>
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
                  <span
                    className={`status-badge ${(profile.status || "active").toLowerCase()}`}
                  >
                    {profile.status || "Active"}
                  </span>
                </span>
                <span className="detail-item">
                  <strong>Joined:</strong>{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Detailed profile view
        <div className="profile-detail-container">
          {editMode ? (
            // Edit form (name only)
            <form onSubmit={handleSubmit} className="edit-profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Detail view
            <div className="profile-details-view">
              <div className="detail-section">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{profile.name}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{profile.email}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">
                    {profile.phone || "Not provided"}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{profile.role}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    <span
                      className={`status-badge ${(profile.status || "active").toLowerCase()}`}
                    >
                      {profile.status || "Active"}
                    </span>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Joined:</span>
                  <span className="detail-value">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="detail-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Name
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="back-button">
            <button
              className="btn btn-link"
              onClick={() => {
                setViewDetail(false);
                setEditMode(false);
              }}
            >
              &larr; Back to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleProfileView;
