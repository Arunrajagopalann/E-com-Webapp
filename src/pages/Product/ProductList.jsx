import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css"; // Import the CSS
const API_BASE = process.env.REACT_APP_BASE_URL;

function ProductList() {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  // Get token
  const accessToken = localStorage.getItem("accessToken");

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log("data", data);
      if (data.success) setProductList(data.data);
      else setProductList([]);
    } catch (error) {
      console.error("Fetch Product Error:", error);
    }
  };

  // Delete product
  const deleteProduct = async (_id) => {
    if (!accessToken) {
      alert("Unauthorized: Please log in.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/products/${_id}`, {
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
      fetchProducts();
    } catch (error) {
      alert("Error deleting product.");
      console.error("Delete Product Error:", error);
    }
  };

  // Navigation helpers (for edit/add)
  const handleEdit = (id) => navigate(`/addProduct?id=${id}&type=edit`);
  const handleAdd = () => navigate("/addProduct?type=add");

  return (
    <div className="product-container">
      <div className="product-header">
        <h1 className="product-title">Product Management</h1>
        <button className="btn-add" onClick={handleAdd}>
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
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td className="product-price">₹{product.price}</td>
                <td>{product.seller}</td>
                <td>
                  <span
                    className={`status-badge ${
                      product.status === "ACTIVE" ? "active" : "inactive"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="action-buttons">
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
      </div>
    </div>
  );
}

export default ProductList;
