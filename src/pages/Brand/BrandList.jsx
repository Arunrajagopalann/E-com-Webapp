import React from "react";
import { useNavigate } from "react-router-dom";
import "./Brand.css"; // Create this file with the styles below

function BrandList() {
  const [brandList, setBrand] = React.useState([]);
  const API_BASE = "http://localhost:8001/api/v1";
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchBrand();
  }, []);

  const fetchBrand = async () => {
    try {
      const response = await fetch(`${API_BASE}/brand`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("response", response);
      const data = await response.json();
      setBrand(data.data);
    } catch (error) {
      console.error("Fetch Brand Error:", error);
    }
  };

  const deleteBrand = async (_id) => {
    try {
      const response = await fetch(`${API_BASE}/brand/${_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      console.log("response", response);
      const data = await response.json();
      fetchBrand();
    } catch (error) {
      console.error("Delete Brand Error:", error);
    }
  };

  return (
    <div className="brand-container">
      <div className="brand-header">
        <h1 className="brand-title">Brand Management</h1>
        <button className="btn-add" onClick={() => navigate("/addBrand")}>
          Add Brand
        </button>
      </div>

      <div className="brand-table-container">
        <table className="brand-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Brand Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brandList.map((brand, index) => (
              <tr key={brand._id || index}>
                <td>{index + 1}</td>
                <td>{brand.brandName}</td>
                <td>
                  <span
                    className={`status-badge ${brand.status === "Active" ? "active" : "inactive"}`}
                  >
                    {brand.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/addBrand?type=edit&id=${brand._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteBrand(brand._id)}
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

export default BrandList;
