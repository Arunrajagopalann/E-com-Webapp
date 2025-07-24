import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands, deleteBrand } from "../../services/api.service";
import "./Brand.css"; // Create this file with the styles below

function BrandList() {
  const [brandList, setBrandList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const fetchBrands =async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBrands();
      if (result.statusCode === 200 ) {
        setBrandList(result.data);
      } else {
        setError(result.message || "Failed to fetch brands");
        setBrandList([]);
      }
    } catch (error) {
      console.error("Fetch brands error:", error);
      setError(error.message || "An error occurred while fetching brands");
      setBrandList([]);
    } finally {
      setLoading(false);
    }
  }
    console.log('Fetching brandList...',brandList);
  
   React.useEffect(() => {
    console.log('Fetching brands...');
      fetchBrands();
    }, []);

  const handleDeleteBrand = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      setLoading(true);
      try {
        const result = await deleteBrand(id);
        if (result.success) {
          alert("Brand deleted successfully!");
          fetchBrands();
        } else {
          alert(result.message || "Failed to delete brand");
        }
      } catch (error) {
        console.error("Delete brand error:", error);
        alert(`Error deleting brand: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="brand-container">
      <div className="brand-header">
        <h1 className="brand-title">Brand Management</h1>
        <button 
          className="btn-add" 
          onClick={() => navigate("/addBrand")}
          disabled={loading}
        >
          Add Brand
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="brand-table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
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
              {brandList.length > 0 ? (
                brandList.map((brand, index) => (
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
                        onClick={() => handleDeleteBrand(brand._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No brands found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BrandList;