import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Brand.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {
  getBrandById,
  createBrand,
  updateBrand,
} from "../../services/api.service";
import ToastMessage from "../../components/ToastMessage";

function AddBrand() {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (msg, variant = "success") => {
    console.log("Showing toast:", msg);
    setToast({ show: true, message: msg, variant });
    setTimeout(() => {
      navigate("/brand");
    }, 500);
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const isEdit = type === "edit";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(false); // Add pending navigation state

  const [formData, setFormData] = useState({
    brandName: "",
    status: "Active",
  });

  const fetchBrandData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        showToast("Unauthorized: Please log in.");
        navigate("/login");
        return;
      }

      console.log(`Fetching brand data for ID: ${id}`);
      const result = await getBrandById(id);

      if (result.success && result.data) {
        console.log("Successfully fetched brand data:", result.data);
        setFormData({
          brandName: result.data.brandName || "",
          status: result.data.status || "Active",
        });
      } else {
        console.error("Failed to fetch brand data:", result);
        setError(result.message || "Failed to load brand data");
        showToast(
          "Failed to load brand data: " + (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Fetch brand error:", error);
      setError(error.message || "An error occurred while fetching brand data");
      alert(`Failed to fetch brand data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit && id) {
      fetchBrandData();
    }
  }, [isEdit, id, fetchBrandData]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast("Please log in first!");
      navigate("/login");
      return;
    }

    try {
      console.log("Form data being submitted:", formData);

      let result;
      if (isEdit) {
        console.log(`Updating brand with ID: ${id}`);
        result = await updateBrand(id, formData);
      } else {
        console.log("Creating new brand");
        result = await createBrand(formData);
      }

      console.log("API Response:", result);

      if (result.stausCode == 200) {
        // Add the pending navigation here too
        setPendingNavigation(true);
        showToast(
         result.message,
          "success"
        );
        // Remove any direct navigation that might be here
        // Do NOT call navigate("/brand") here
      } else {
        setError(result.message || "Operation failed");
        setPendingNavigation(true); // Set pending navigation flag
        showToast(
          ` ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "An error occurred");
      showToast(`${isEdit ? "Update" : "Create"} failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-form-container">
      <div className="form-header">
        <h1>{isEdit ? "Edit Brand" : "Add Brand"}</h1>
        <button className="btn-back" onClick={() => navigate("/brand")}>
          Back to Brands
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-group">
          <label htmlFor="brandName">Brand Name*</label>
          <input
            id="brandName"
            type="text"
            value={formData.brandName}
            name="brandName"
            onChange={handleInputChange}
            placeholder="Enter brand name"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Processing..." : isEdit ? "Update Brand" : "Add Brand"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/brand")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      <ToastMessage
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => {
          console.log("Toast closing");
          // setToast({ ...toast, show: false });

          if (pendingNavigation) {
            console.log("Navigating after toast closed");
            setPendingNavigation(false);
            navigate("/brand");
          }
        }}
      />
    </div>
  );
}

export default AddBrand;
