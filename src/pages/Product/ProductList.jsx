import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css"; // Import the CSS
import ToastMessage from "../../components/ToastMessage";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
const API_BASE = process.env.REACT_APP_BASE_URL;

function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 5;
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (msg, variant = "success") => {
    console.log("Showing toast:", msg);
    setToast({ show: true, message: msg, variant });
    setTimeout(() => {
      navigate("/product");
    }, 500);
  };
  const [pendingNavigation, setPendingNavigation] = useState(false); // Add pending navigation
  const [productList, setProductList] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Add this state variable for storing all products
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get token
  const accessToken = localStorage.getItem("accessToken");

  // Fetch all products
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE}/products`, // Remove pagination parameters
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      console.log("All products data:", data);

      if (response.status === 200) {
        // Store all products
        setAllProducts(data.data);
        // Set total count
        setTotalProducts(data.data.length);
        // Update displayed products based on current page
        updateDisplayedProducts(data.data, currentPage);
      } else {
        setProductList([]);
        setAllProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Fetch Product Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle client-side pagination
  const updateDisplayedProducts = (products, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    console.log(`Displaying products from index ${startIndex} to ${endIndex}`);
    setProductList(products.slice(startIndex, endIndex));
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Delete product
  const deleteProduct = async (id) => {
    Swal.fire({
      title: "Do you want to delete this?",
      showCancelButton: true,
      confirmButtonText: "Ok",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE}/products/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const result = await response.json();

          if (result.statusCode === 200) {
            Swal.fire({
              title: result.message || "Product deleted successfully",
              icon: "success",
            }).then(async (result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                fetchProducts();
              }
            });
          } else {
            Swal.fire({
              title: result.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Delete product error:", error);
        } finally {
          setLoading(false);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  // Navigation helpers (for edit/add)
  const handleEdit = (id) => navigate(`/addProduct?id=${id}&type=edit`);
  const handleAdd = () => navigate("/addProduct?type=add");

  return (
    <div className="product-container">
      <div className="product-header">
        <h1 className="product-title">Product Management</h1>
        <button className="btn-add" onClick={() => navigate("/addProduct")} disabled={loading}>
          Add Product
        </button>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product, index) => (
              <tr key={product._id || index}>
                <td data-label="S.No">{index + 1}</td>
                <td data-label="Product Name">{product.name}</td>
                <td data-label="Price" className="product-price">₹{product.price}</td>
                <td data-label="Seller">{product.seller}</td>
                <td data-label="Status">
                  <span
                    className={`status-badge ${
                      product.status === "ACTIVE" ? "active" : "inactive"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td data-label="Actions" className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteProduct(product._id)}
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
            navigate("/product");
          }
        }}
      />
    </div>
  );
}

export default ProductList;
