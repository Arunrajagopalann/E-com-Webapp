import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

function AddWarehouse() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id')
  const type = searchParams.get('type')

  console.log('id', id)
  
  const [formData, setFormData] = useState({
    warehouseName: '',
    warehouseType: 'Distribution Center',
    address: [
      {
        addressType: 'Primary',
        addressLine1: '',
        addressLine2: '',
        country: 'India',
        state: '',
        city: '',
        postalCode: ''
      },
      {
        addressType: 'Secondary',
        addressLine1: '',
        addressLine2: '',
        country: 'India',
        state: '',
        city: '',
        postalCode: ''
      }
    ],
    poc: '',
    stock: 0,
    status: 'ACTIVE'
  });
  
console.log("formDAta",formData);


  const API_BASE = 'http://localhost:8001/api/v1'
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleAddressChange = (index, field, value) => {
    const updatedAddress = [...formData.address];
    updatedAddress[index][field] = value;
    setFormData({ ...formData, address: updatedAddress });
  }

  useEffect(() => {
    console.log('type', type, type === 'edit')
    if (type === 'edit') {
      fetchWarehouse();
    }
  }, [type])

  const fetchWarehouse = async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('dataaaa',data);
      
      setFormData(data.data[0]);
    } catch (error) {
      console.error('Fetch warehouse error:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = type === 'edit' ? `${API_BASE}/warehouse/${id}` : `${API_BASE}/warehouse`;
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
          warehouseName: '',
          warehouseType: 'Distribution Center',
          address: [
            {
              addressType: 'Primary',
              addressLine1: '',
              addressLine2: '',
              country: 'India',
              state: '',
              city: '',
              postalCode: ''
            },
            {
              addressType: 'Secondary',
              addressLine1: '',
              addressLine2: '',
              country: 'India',
              state: '',
              city: '',
              postalCode: ''
            }
          ],
          poc: '',
          stock: 0,
          status: 'ACTIVE'
        });
        navigate('/warehouse');
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  }

  return (
    <div>
      <h2>{type === 'edit' ? 'Edit Warehouse' : 'Add Warehouse'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Warehouse Name:</label>
          <input 
            type="text" 
            value={formData.warehouseName} 
            name="warehouseName" 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div>
          <label>Warehouse Type:</label>
          <select 
            name="warehouseType" 
            value={formData.warehouseType} 
            onChange={handleInputChange}
          >
            <option value="Distribution Center">Distribution Center</option>
            <option value="Fulfillment Center">Fulfillment Center</option>
            <option value="Storage Facility">Storage Facility</option>
            <option value="Cold Storage">Cold Storage</option>
          </select>
        </div>

        <div>
          <label>POC (Point of Contact):</label>
          <input 
            type="text" 
            value={formData.poc} 
            name="poc" 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div>
          <label>Stock:</label>
          <input 
            type="number" 
            value={formData.stock} 
            name="stock" 
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
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Primary Address */}
        <div>
          <h3>Primary Address</h3>
          <div>
            <label>Address Line 1:</label>
            <input 
              type="text" 
              value={formData.address[0].addressLine1} 
              onChange={(e) => handleAddressChange(0, 'addressLine1', e.target.value)}
              required 
            />
          </div>
          <div>
            <label>Address Line 2:</label>
            <input 
              type="text" 
              value={formData.address[0].addressLine2} 
              onChange={(e) => handleAddressChange(0, 'addressLine2', e.target.value)}
            />
          </div>
          <div>
            <label>Country:</label>
            <input 
              type="text" 
              value={formData.address[0].country} 
              onChange={(e) => handleAddressChange(0, 'country', e.target.value)}
              required 
            />
          </div>
          <div>
            <label>State:</label>
            <input 
              type="text" 
              value={formData.address[0].state} 
              onChange={(e) => handleAddressChange(0, 'state', e.target.value)}
              required 
            />
          </div>
          <div>
            <label>City:</label>
            <input 
              type="text" 
              value={formData.address[0].city} 
              onChange={(e) => handleAddressChange(0, 'city', e.target.value)}
              required 
            />
          </div>
          <div>
            <label>Postal Code:</label>
            <input 
              type="text" 
              value={formData.address[0].postalCode} 
              onChange={(e) => handleAddressChange(0, 'postalCode', e.target.value)}
              required 
            />
          </div>
        </div>

        {/* Secondary Address */}
        <div>
          <h3>Secondary Address</h3>
          <div>
            <label>Address Line 1:</label>
            <input 
              type="text" 
              value={formData.address[1].addressLine1} 
              onChange={(e) => handleAddressChange(1, 'addressLine1', e.target.value)}
            />
          </div>
          <div>
            <label>Address Line 2:</label>
            <input 
              type="text" 
              value={formData.address[1].addressLine2} 
              onChange={(e) => handleAddressChange(1, 'addressLine2', e.target.value)}
            />
          </div>
          <div>
            <label>Country:</label>
            <input 
              type="text" 
              value={formData.address[1].country} 
              onChange={(e) => handleAddressChange(1, 'country', e.target.value)}
            />
          </div>
          <div>
            <label>State:</label>
            <input 
              type="text" 
              value={formData.address[1].state} 
              onChange={(e) => handleAddressChange(1, 'state', e.target.value)}
            />
          </div>
          <div>
            <label>City:</label>
            <input 
              type="text" 
              value={formData.address[1].city} 
              onChange={(e) => handleAddressChange(1, 'city', e.target.value)}
            />
          </div>
          <div>
            <label>Postal Code:</label>
            <input 
              type="text" 
              value={formData.address[1].postalCode} 
              onChange={(e) => handleAddressChange(1, 'postalCode', e.target.value)}
            />
          </div>
        </div>

        <button type="submit">
          {type === 'edit' ? 'Update Warehouse' : 'Add Warehouse'}
        </button>

       
      </form>
    </div>
  )
}

export default AddWarehouse