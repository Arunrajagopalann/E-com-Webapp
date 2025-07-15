import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Brand.css"; // Create this file with the styles below

function AddBrand() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    brandName: "",
    status: "Active",
  });

  const API_BASE = "http://localhost:8001/api/v1";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`${API_BASE}/brand/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setFormData({
          brandName: data.data.brandName,
          status: data.data.status,
        });
      } catch (error) {
        console.error("Fetch brand error:", error);
      }
    };

    if (type === "edit") {
      fetchBrand();
    }
  }, [type, id, API_BASE]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url =
        type === "edit" ? `${API_BASE}/brand/${id}` : `${API_BASE}/brand`;
      const methodType = type === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method: methodType,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        // Reset form after successful submission
        setFormData({
          brandName: "",
          status: "Active",
        });
        navigate("/brand");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="brand-form-container">
      <div className="form-header">
        <h1>{type === "edit" ? "Edit Brand" : "Add Brand"}</h1>
        <button className="btn-back" onClick={() => navigate("/brand")}>
          Back to Brands
        </button>
      </div>

      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-group">
          <label>Brand Name</label>
          <input
            type="text"
            value={formData.brandName}
            name="brandName"
            onChange={handleInputChange}
            placeholder="Enter brand name"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
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
            {type === "edit" ? "Update Brand" : "Add Brand"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/brand")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBrand;
