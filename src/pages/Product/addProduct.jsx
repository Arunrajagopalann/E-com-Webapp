import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Product.css";
import { useToast } from "../../context/ToastContext"; // Import global toast
import Loader from "../../components/loading";
function AddProduct() {
  const { showToast } = useToast(); // Use global toast

  const [pendingNavigation, setPendingNavigation] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const isEdit = type === "edit";
  const accessToken = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    warehouse: "",
    category: "", // Changed from categoryId
    brand: "", // Changed from brandId
    stock: "",
    seller: "",
    images: [],
    featured: false,
    status: "ACTIVE",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouse, setWarehouse] = useState([]);

  const API_BASE = process.env.REACT_APP_BASE_URL;

  const createProduct = async (productData) => {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  };

  const updateProduct = async (id, productData) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  };

  const fetchCategories = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [API_BASE, accessToken]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/brand`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, [API_BASE, accessToken]);

  const fetchWarehouse = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log("Warehouse data:", data.data);

      if (data.statusCode === 200) {
        setWarehouse(data.data);
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
    }
  }, [API_BASE, accessToken]);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        setFormData({
          ...formData,
          ...data.data,
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, [API_BASE, accessToken, id]);

  useEffect(() => {
    // Fetch categories and brands on component mount
    fetchCategories();
    fetchBrands();
    fetchWarehouse();
  }, []);

  // Separate useEffect for edit functionality
  useEffect(() => {
    if (isEdit && id) {
      fetchProductData();
    }
  }, [isEdit, id, fetchProductData]);

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData({
      ...formData,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...files.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isEdit) {
        result = await updateProduct(id, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result.statusCode === 200) {
        showToast(result.message, "success", () => {
          navigate("/product");
        }); // Use global toast
      } else {
        setError(result.message || "Operation failed");
        showToast(
          `${isEdit ? "Update" : "Create"} failed: ${result.message || "Unknown error"}`,
          "danger"
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message || "An error occurred");
      showToast(
        `${isEdit ? "Update" : "Create"} failed: ${error.message}`,
        "danger", () => {
          console.error("Operation error:", error);
        }
      );
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="product-form-container">
      <div className="form-header">
        <h1>{isEdit ? "Edit Product" : "Add Product"}</h1>
        <button className="btn-back" onClick={() => navigate("/product")}>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Product Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="seller">Seller</label>
            <input
              type="text"
              id="seller"
              name="seller"
              value={formData.seller}
              onChange={handleInputChange}
              placeholder="Product Seller"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product description"
            rows="4"
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category*</label>{" "}
            {/* Changed from categoryId */}
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand*</label>
            <select
              id="brand"
              name="brand" /* Changed from brandId */
              value={formData.brand} /* Changed from brandId */
              onChange={handleInputChange}
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="warehouse">Warehouse</label>
            <select
              id="warehouse"
              name="warehouse"
              value={formData.warehouse}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Warehouse</option>
              {warehouse.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.warehouseName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Regular price"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {isEdit ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/product")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
