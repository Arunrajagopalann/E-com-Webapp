import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: '',
    warehouse: '',
    seller: '',
    images: [],
    status: 'ACTIVE',
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const API_BASE = 'http://localhost:8000/api/v1';

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        const data = await response.json();
        if (data.statusCode === 200) {
          setFormData(data.data);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchCategories();
    fetchBrands();
    fetchWarehouses();
    if (type === 'edit') {
      fetchProductDetails();
    }
  }, [type, id, API_BASE]);


  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category`);
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE}/brand`);
      const data = await response.json();
      setBrands(data.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse`);
      const data = await response.json();
      setWarehouses(data.data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.value.split(',') });
  };

  const createProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      console.log('Server Response:', response);
      const data = await response.json();
      console.log('Parsed Data:', data);
      if (data.statusCode === 200 || data.statusCode === 201) {
        navigate('/product');
      } else {
        console.error('Product creation failed with status code:', data.statusCode);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const updateProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        navigate('/product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'edit') {
      updateProduct();
    } else {
      createProduct();
    }
  };

  return (
    <div>
      <h2>{type === 'edit' ? 'Edit' : 'Add'} Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Brand:</label>
          <select name="brand" value={formData.brand} onChange={handleInputChange} required>
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>{b.brandName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Warehouse:</label>
          <select name="warehouse" value={formData.warehouse} onChange={handleInputChange} required>
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>{w.warehouseName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Seller:</label>
          <input type="text" name="seller" value={formData.seller} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Images (comma-separated URLs):</label>
          <input type="text" name="images" value={formData.images.join(',')} onChange={handleImageChange} />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <button type="submit">{type === 'edit' ? 'Update' : 'Add'} Product</button>
      </form>
    </div>
  );
}

export default AddProduct;