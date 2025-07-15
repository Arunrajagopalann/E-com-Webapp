import React from "react";
import { useNavigate } from "react-router-dom";
import "./Warehouse.css"; // Import the CSS

function WarehouseList() {
  const [warehouseList, setWarehouse] = React.useState([]);
  const API_BASE = "http://localhost:8001/api/v1";
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchWarehouse();
  }, []);

  const fetchWarehouse = async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("response", response);
      const data = await response.json();
      setWarehouse(data.data);
    } catch (error) {
      console.error("Fetch Warehouse Error:", error);
    }
  };
  const deleteWarehouse = async (_id) => {
    try {
      const response = await fetch(`${API_BASE}/warehouse/${_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      console.log("response", response);

      const data = await response.json();
      fetchWarehouse();
    } catch (error) {
      console.error("Delete Warehouse Error:", error);
    }
  };
  return (
    <div className="warehouse-container">
      <div className="warehouse-header">
        <h1 className="warehouse-title">Warehouse Management</h1>
        <button className="btn-add" onClick={() => navigate("/addWarehouse")}>
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
                    onClick={() =>
                      navigate(`/addWarehouse?type=edit&id=${warehouse._id}`)
                    }
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
