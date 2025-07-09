import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

function AddBrand() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')
  const type = searchParams.get('type')

  console.log('id', id)
  
  const [formData, setFormData] = useState({
    brandName: '',
    status: "Active"
  });

  
  const API_BASE = 'http://localhost:8000/api/v1'
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`${API_BASE}/brand/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setFormData({
          brandName: data.data.brandName,
          status: data.data.status
        });
      } catch (error) {
        console.error('Fetch brand error:', error);
      }
    }

    console.log('type', type, type === 'edit')
    if (type === 'edit') {
      fetchBrand();
    }
  }, [type, id, API_BASE])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = type === 'edit' ? `${API_BASE}/brand/${id}` : `${API_BASE}/brand`;
      const methodType = (type === 'edit') ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: methodType,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (data.statusCode === 200) {
        // Reset form after successful submission
        setFormData({
          brandName: '',
          status: "Active"
        });
        navigate('/brand');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  }

  return (
    <div>
      <h2>{type === 'edit' ? 'Edit Brand' : 'Add Brand'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand Name:</label>
          <input 
            type="text" 
            value={formData.brandName} 
            name="brandName" 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div>
          <label>Status:</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit">
          {type === 'edit' ? 'Update Brand' : 'Add Brand'}
        </button>
      </form>
    </div>
  )
}

export default AddBrand