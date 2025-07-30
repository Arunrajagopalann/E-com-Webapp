import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext"; // Import the global toast hook
import "./Brand.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Loader from "../../components/loading";
import {
  getBrandById,
  createBrand,
  updateBrand,
} from "../../services/api.service";

function AddBrand() {
  const { showToast } = useToast(); // Add this line to use global toast

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const isEdit = type === "edit";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        showToast("Unauthorized: Please log in.", 'danger', () => {
          navigate("/login");
        });
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
          "Failed to load brand data: ", 'danger', () => {
            console.error("Failed to load brand data:", result);
          }
        );
      }
    } catch (error) {
      console.error("Fetch brand error:", error);
      setError(error.message || "An error occurred while fetching brand data");
      showToast(`Failed to fetch brand data: ${error.message}`, 'danger', () => {
        console.error("Failed to fetch brand data:", error);
      });
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
      showToast("Please log in first!",'danger',()=>{
        navigate("/login");
      }
      );
      // navigate("/login");
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

      if (result.statusCode === 200) {
        showToast(result.message, "success",()=>{
          navigate("/brand");
        }); // Use global toast
        // navigate("/brand"); 
      } else {
        setError(result.message || "Operation failed");
        showToast(
          `${isEdit ? "Update" : "Create"} failed: ${
            result.message || "Unknown error"
          }`,
          "danger", () => {
            console.error("Operation error:", result);
          }
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "An error occurred");
      showToast(
        `${isEdit ? "Update" : "Create"} failed: ${error.message}`,
        "danger", () => {
          console.error("Operation error:", error);
        }
      );
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
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
       
    </div>
  );
}

export default AddBrand;
