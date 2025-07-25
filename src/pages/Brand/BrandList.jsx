import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands, deleteBrand } from "../../services/api.service";
import "./Brand.css"; // Create this file with the styles below
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ToastMessage from "../../components/ToastMessage";
import Swal from "sweetalert2";
function BrandList() {
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
  const [pendingNavigation, setPendingNavigation] = useState(false); // Add pending navigation state
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBrands();
      if (result.statusCode === 200) {
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
  };
  console.log("Fetching brandList...", brandList);

  React.useEffect(() => {
    console.log("Fetching brands...");
    fetchBrands();
  }, []);

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
              title: result.message ,
              icon: "error",
            })
          }
        } catch (error) {
          console.error("Delete brand error:", error);
          showToast(`Error deleting brand: ${error.message}`, "error");
        } finally {
          setLoading(false);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
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
