import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Product.css";

function AddProduct() {
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
    salePrice: "",
    category: "",  // Changed from categoryId
    brand: "",     // Changed from brandId
    stock: "",
    sku: "",
    images: [],
    featured: false,
    status: "ACTIVE",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const API_BASE = process.env.REACT_APP_BASE_URL;

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
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
  }, [fetchCategories, fetchBrands]);
  
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
      images: [...prev.images, ...files.map((file) => URL.createObjectURL(file))],
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
    if (!accessToken) {
      alert("Unauthorized: Please log in.");
      return;
    }
    try {
      const url = isEdit ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
      const method = isEdit ? "PUT" : "POST";
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock, 10),
        // No need to rename fields here anymore since we're using brand and category directly
      };
      
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        alert(data.message || (isEdit ? "Update failed." : "Create failed."));
        return;
      }
      navigate("/product");
    } catch (error) {
      alert(isEdit ? "Error updating product." : "Error creating product.");
      console.error("Submit error:", error);
    }
  };

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
            <label htmlFor="sku">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              placeholder="Product SKU"
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
            <label htmlFor="category">Category*</label>  {/* Changed from categoryId */}
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
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
              name="brand"  /* Changed from brandId */
              value={formData.brand}  /* Changed from brandId */
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

          <div className="form-group">
            <label htmlFor="salePrice">Sale Price</label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              placeholder="Sale price (if applicable)"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock*</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Available stock"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="images">Product Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
          />

          {formData.images.length > 0 && (
            <div className="image-preview-container">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview-wrapper">
                  <div className="image-preview">{image}</div>
                  <button
                    type="button"
                    className="btn-delete-image"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label htmlFor="featured" className="checkbox-label">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              Feature this product
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
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