import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBrand } from "../../services/api.service";
import "./Brand.css"; // Create this file with the styles below
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ToastMessage from "../../components/ToastMessage";
import Swal from "sweetalert2";
const API_BASE = process.env.REACT_APP_BASE_URL;
function BrandList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (msg, variant = "success") => {
    console.log("Showing toast:", msg);
    setToast({ show: true, message: msg, variant });
    setTimeout(() => {
      navigate("/brand");
    }, 500);
  };
  const [brandList, setBrandList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allBrands, setAllBrands] = useState([]); // Add this missing state // Add this missing state
  const itemsPerPage = 5;
  const accessToken = localStorage.getItem("accessToken");
  const totalPages = Math.ceil(totalBrands / itemsPerPage);
  const [pendingNavigation, setPendingNavigation] = useState(false); // Add pending navigation state
  const updateDisplayBrands = (brands, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, brands.length);
    console.log(`Displaying brands from index ${startIndex} to ${endIndex}`);
    setBrandList(brands.slice(startIndex, endIndex));
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (allBrands.length > 0) {
      updateDisplayBrands(allBrands, currentPage);
    }
  }, [currentPage, allBrands]);

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/brand`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      // Fix if/else structure with proper curly braces
      if (response.status === 200) {
        setAllBrands(data.data);
        setTotalBrands(data.data.length);
        updateDisplayBrands(data.data, currentPage);
      } else {
        setBrandList([]);
        setAllBrands([]);
        setTotalBrands(0);
      }
    } catch (error) {
      console.error("Fetch Brand Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    Swal.fire({
      title: "Do you want to delete this?",
      showCancelButton: true,
      confirmButtonText: "Ok",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await deleteBrand(id);
          if (result.statusCode === 200) {
            Swal.fire({
              title: result.message || "Brand deleted successfully",
              icon: "success",
            }).then(async (result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                fetchBrands();
              }
            });
          } else {
            Swal.fire({
              title: result.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Delete brand error:", error);
        } finally {
          setLoading(false);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  useEffect(() => {
    fetchBrands();
  }, []);

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
                    <td data-label="S.No">{index + 1}</td>
                    <td data-label="Brand Name">{brand.brandName}</td>
                    <td data-label="Status">
                      <span
                        className={`status-badge ${brand.status === "Active" ? "active" : "inactive"}`}
                      >
                        {brand.status}
                      </span>
                    </td>
                    <td data-label="Actions" className="action-buttons">
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
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end pe-2 pt-3">
              {/* Previous Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
            navigate("/brand");
          }
        }}
      />
    </div>
  );
}

export default BrandList;
