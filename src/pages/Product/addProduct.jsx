import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Product.css";

function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const isEdit = type === "edit";

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    categoryId: "",
    brandId: "",
    stock: "",
    sku: "",
    images: [],
    featured: false,
    status: "ACTIVE",
  });

  const API_BASE = "http://localhost:8001/api/v1";

  useEffect(() => {
    // Fetch categories and brands for dropdowns
    fetchCategories();
    fetchBrands();

    if (isEdit && id) {
      fetchProductData();
    }
  }, [isEdit, id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE}/brand`);
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    // For demo purposes, just store the file names
    // In a real app, you would upload these to a server or cloud storage
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: [...formData.images, ...files.map((file) => file.name)],
    });
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEdit ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
      const method = isEdit ? "PUT" : "POST";

      // In a real app, you'd handle file uploads properly
      // This is just a simplified example
      const productData = {
        ...formData,
        // Convert string values to numbers
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock, 10),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        navigate("/product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
            <label htmlFor="categoryId">Category*</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
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
            <label htmlFor="brandId">Brand*</label>
            <select
              id="brandId"
              name="brandId"
              value={formData.brandId}
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
