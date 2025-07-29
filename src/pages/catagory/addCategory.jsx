import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Category.css";
import ToastMessage from "../../components/ToastMessage";

function AddCatagory() {
  const [pendingNavigation, setPendingNavigation] = useState(false);
  const [error, setError] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (msg, variant = "success") => {
    console.log("Showing toast:", msg);
    setToast({ show: true, message: msg, variant });
    setTimeout(() => {
      navigate("/category");
    }, 1000);
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const isEdit = type === "edit";

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    status: "Active",
  });

  const API_BASE = process.env.REACT_APP_BASE_URL;
  useEffect(() => {
    if (isEdit && id) {
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
      if (data.statusCode == 200) {
        setFormData({
          categoryName: data.data.categoryName || "",
          description: data.data.description || "",
          status: data.data.status || "Active",
        });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Unauthorized: Please log in.");
      return;
    }
    try {
      const url = isEdit
        ? `${API_BASE}/category/${id}`
        : `${API_BASE}/category`;
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.statusCode == 200) {
        // Add the pending navigation here too
        setPendingNavigation(true);
        showToast(result.message, "success");
        // Remove any direct navigation that might be here
        // Do NOT call navigate("/brand") here
      } else {
        setError(result.message || "Operation failed");
        setPendingNavigation(true); // Set pending navigation flag
        showToast(` ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(isEdit ? "Error updating category." : "Error creating category.");
      console.error("Submit error:", error);
    }
  };

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
          <button type="submit" className="btn-submit">
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
            navigate("/warehouse");
          }
        }}
      />
    </div>
  );
}

export default AddCatagory;
