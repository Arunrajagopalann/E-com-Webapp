import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Category.css";

function AddCatagory() {
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

  const API_BASE = "http://localhost:8001/api/v1";

  useEffect(() => {
    if (isEdit && id) {
      fetchCategoryData();
    }
  }, [isEdit, id]);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`${API_BASE}/category/${id}`);
      const data = await response.json();
      if (data.success) {
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

    try {
      const url = isEdit
        ? `${API_BASE}/category/${id}`
        : `${API_BASE}/category`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        navigate("/category");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
    </div>
  );
}

export default AddCatagory;
