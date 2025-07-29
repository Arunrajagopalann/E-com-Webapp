import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Warehouse.css";
import ToastMessage from "../../components/ToastMessage";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
const API_BASE = process.env.REACT_APP_BASE_URL;

function WarehouseList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouseList, setWarehouseList] = useState([]);
  const [allWarehouses, setAllWarehouses] = useState([]); // Add this missing state
  const [totalWarehouses, setTotalWarehouses] = useState(0); // Add this missing state
  const itemsPerPage = 3; // Add this for pagination
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get token
  const accessToken = localStorage.getItem("accessToken");

  // Calculate total pages
  const totalPages = Math.ceil(totalWarehouses / itemsPerPage);

  // Add this missing function
  const updateDisplayWarehouses = (warehouses, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, warehouses.length);
    console.log(
      `Displaying warehouses from index ${startIndex} to ${endIndex}`
    );
    setWarehouseList(warehouses.slice(startIndex, endIndex));
  };

  // Fetch all warehouses
  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Update displayed warehouses when page changes
  useEffect(() => {
    if (allWarehouses.length > 0) {
      updateDisplayWarehouses(allWarehouses, currentPage);
    }
  }, [currentPage, allWarehouses]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/warehouse`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      // Fix if/else structure with proper curly braces
      if (response.status === 200) {
        setAllWarehouses(data.data);
        setTotalWarehouses(data.data.length);
        updateDisplayWarehouses(data.data, currentPage);
      } else {
        setWarehouseList([]);
        setAllWarehouses([]);
        setTotalWarehouses(0);
      }
    } catch (error) {
      console.error("Fetch Warehouse Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete warehouse
  const deleteWarehouse = async (id) => {
    Swal.fire({
      title: "Do you want to delete this?",
      showCancelButton: true,
      confirmButtonText: "Ok",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE}/warehouse/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const result = await response.json();

          if (result.statusCode === 200) {
            Swal.fire({
              title: result.message || "Warehouse deleted successfully",
              icon: "success",
            }).then(async (result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                fetchWarehouses();
              }
            });
          } else {
            Swal.fire({
              title: result.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Delete warehouse error:", error);
        } finally {
          setLoading(false);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  return (
    <div className="warehouse-container">
      <div className="warehouse-header">
        <h1 className="warehouse-title">Warehouse Management</h1>
        <button
          className="btn-add"
          onClick={() => navigate("/warehouse/add")}
          disabled={loading}
        >
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
                      navigate(`/warehouse/add?type=edit&id=${warehouse._id}`)
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
        <div>
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                &laquo;
              </button>
            </li>

            {/* Dynamic Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
      </div>
    </div>
  );
}
export default WarehouseList;
