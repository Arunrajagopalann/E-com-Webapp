import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import "./Category.css";
import Loader from "../../components/loading";
function AddCategory() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const alertDuration = 3000; 
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    status: "Active",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const id = new URLSearchParams(location.search).get("id");
  const isEdit = Boolean(id);

  const API_BASE = process.env.REACT_APP_BASE_URL;

  const updateCategory = async (id, categoryData) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE}/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  };

  const createCategory = async (categoryData) => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  };

  useEffect(() => {
    if (isEdit) {
      fetchCategoryData();
    }
  }, [isEdit, id]);

  const fetchCategoryData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE}/category/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setFormData({
          categoryName: data.data.categoryName || "",
          description: data.data.description || "",
          status: data.data.status || "Active",
        });
      } else {
        setError(data.message || "Failed to fetch category data");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Error fetching category data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isEdit) {
        result = await updateCategory(id, formData);
      } else {
        result = await createCategory(formData);
      }

      if (result.statusCode === 200) {
        showToast(result.message, "success", () => {
          navigate("/category");
        }); // Use global toast
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
    <div className="category-form-container">
      <div className="form-header">
        <h1>{isEdit ? "Edit Category" : "Add Category"}</h1>
        <button className="btn-back" onClick={() => navigate("/category")}>
          Back to Categories
        </button>
      </div>

      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="categoryName">Category Name*</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleInputChange}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter category description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {isEdit ? "Update Category" : "Add Category"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/category")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
