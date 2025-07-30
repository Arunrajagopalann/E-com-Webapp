import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"; // Added useSearchParams
import { useToast } from "../../context/ToastContext";
import "./Warehouse.css";
import Loader from "../../components/loading";
function AddWarehouse() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const isEdit = type === "edit";

  // Add missing state variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    warehouseName: "",
    warehouseType: "PRIMARY",
    poc: "",
    phone: "",
    email: "",
    stock: "",
    status: "ACTIVE",
    address: [
      {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    ],
  });

  const API_BASE = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (isEdit && id) {
      fetchWarehouseData();
    }
  }, [isEdit, id]);

  const fetchWarehouseData = async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (data.statusCode === 200) {
        setFormData(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (e, index) => {
    const { name, value } = e.target;
    const updatedAddress = [...formData.address];
    updatedAddress[index] = {
      ...updatedAddress[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      address: updatedAddress,
    });
  };

  const updateWarehouse = async (id, warehouseData) => {
    const response = await fetch(`${API_BASE}/warehouse/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(warehouseData),
    });
    return response.json();
  };

  const createWarehouse = async (warehouseData) => {
    const response = await fetch(`${API_BASE}/warehouse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(warehouseData),
    });
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isEdit) {
        result = await updateWarehouse(id, formData);
      } else {
        result = await createWarehouse(formData);
      }

      if (result.statusCode === 200) {
        showToast(result.message, "success", () => {
          navigate("/warehouse");
        }); 
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
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="warehouse-form-container">
      <div className="form-header">
        <h1>{isEdit ? "Edit Warehouse" : "Add Warehouse"}</h1>
        <button className="btn-back" onClick={() => navigate("/warehouse")}>
          Back to Warehouses
        </button>
      </div>

      <form onSubmit={handleSubmit} className="warehouse-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="warehouseName">Warehouse Name*</label>
            <input
              type="text"
              id="warehouseName"
              name="warehouseName"
              value={formData.warehouseName}
              onChange={handleInputChange}
              placeholder="Enter warehouse name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="warehouseType">Type</label>
            <select
              id="warehouseType"
              name="warehouseType"
              value={formData.warehouseType}
              onChange={handleInputChange}
              required
            >
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
              <option value="DISTRIBUTION">Distribution</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="poc">Point of Contact</label>
            <input
              type="text"
              id="poc"
              name="poc"
              value={formData.poc}
              onChange={handleInputChange}
              placeholder="Contact person name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Contact phone number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Contact email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Current stock amount"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="address-section">
          <h3>Address</h3>
          <div className="address-grid">
            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1*</label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.address[0].addressLine1}
                onChange={(e) => handleAddressChange(e, 0)}
                placeholder="Street address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.address[0].addressLine2}
                onChange={(e) => handleAddressChange(e, 0)}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.address[0].city}
                onChange={(e) => handleAddressChange(e, 0)}
                placeholder="City"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province*</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.address[0].state}
                onChange={(e) => handleAddressChange(e, 0)}
                placeholder="State or province"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Postal Code*</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.address[0].zipCode}
                onChange={(e) => handleAddressChange(e, 0)}
                placeholder="ZIP or postal code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country*</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.address[0].country}
                onChange={(e) => handleAddressChange(e, 0)}
                placeholder="Country"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {isEdit ? "Update Warehouse" : "Add Warehouse"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/warehouse")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddWarehouse;
