import React from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css"; // Import the CSS

function ProductList() {
  const [products, setProducts] = React.useState([]);
  const API_BASE = "http://localhost:8001/api/v1";
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if(data.statusCode == 200) {
        setProducts(data.data);
      }else{
         setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h1 className="product-title">Product Management</h1>
        <button className="btn-add" onClick={() => navigate("/addProduct")}>
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
            {products.map((product, index) => (
              <tr key={product._id || index}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td className="product-price">${product.price}</td>
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
                    onClick={() =>
                      navigate(`/addProduct?type=edit&id=${product._id}`)
                    }
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
