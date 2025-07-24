import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Warehouse.css"; // Import the CSS
const API_BASE = process.env.REACT_APP_BASE_URL;

function WarehouseList() {
  const [warehouseList, setWarehouseList] = useState([]);
  const navigate = useNavigate();

  // Get token
  const accessToken = localStorage.getItem("accessToken");

  // Fetch all warehouses
  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) setWarehouseList(data.data);
      else setWarehouseList([]);
    } catch (error) {
      console.error("Fetch Warehouse Error:", error);
    }
  };

  // Delete warehouse
  const deleteWarehouse = async (_id) => {
    if (!accessToken) {
      alert("Unauthorized: Please log in.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/warehouse/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(data.message || "Delete failed.");
        return;
      }
      fetchWarehouses();
    } catch (error) {
      alert("Error deleting warehouse.");
      console.error("Delete Warehouse Error:", error);
    }
  };

  // Navigation helpers (for edit/add)
  const handleEdit = (id) => navigate(`/warehouse/add?id=${id}&type=edit`);
  const handleAdd = () => navigate("/warehouse/add?type=add");

  return (
    <div className="warehouse-container">
      <div className="warehouse-header">
        <h1 className="warehouse-title">Warehouse Management</h1>
        <button className="btn-add" onClick={handleAdd}>
          Add Warehouse
        </button>
      </div>

      <div className="warehouse-table-container">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Warehouse Name</th>
              <th>Type</th>
              <th>Primary Address</th>
              <th>POC</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouseList.map((warehouse, index) => (
              <tr key={warehouse._id || index}>
                <td>{index + 1}</td>
                <td>{warehouse.warehouseName}</td>
                <td>{warehouse.warehouseType}</td>
                <td>
                  {warehouse.address &&
                    warehouse.address.length > 0 &&
                    `${warehouse.address[0].addressLine1}, ${warehouse.address[0].city}`}
                </td>
                <td>{warehouse.poc}</td>
                <td>{warehouse.stock}</td>
                <td>
                  <span
                    className={`status-badge ${warehouse.status === "ACTIVE" ? "active" : "inactive"}`}
                  >
                    {warehouse.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(warehouse._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteWarehouse(warehouse._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WarehouseList;
