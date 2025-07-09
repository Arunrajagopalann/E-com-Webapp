import React from 'react'
import { useNavigate } from 'react-router-dom'

function BrandList() {
  const [brandList, setBrand] = React.useState([]);
  const API_BASE = 'http://localhost:8000/api/v1'
  const navigate = useNavigate()
  
  React.useEffect(() => {
    fetchBrand();
  }, [])
  
  const fetchBrand = async () => {
    try {
      const response = await fetch(`${API_BASE}/brand`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('response', response)
      const data = await response.json();
      setBrand(data.data);
    } catch (error) {
      console.error('Fetch Brand Error:', error)
    }
  }
  
  return (
    <div>
      <button className="btn btn-primary" onClick={() => navigate('/addBrand')}>
        Add Brand
      </button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Brand Name</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {brandList.map((brand, index) => (
            <tr key={brand._id || index}>
              <th scope="row">{index + 1}</th>
              <td 
                onClick={() => navigate(`/addBrand?type=edit&id=${brand._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {brand.brandName}
              </td>
              <td>{brand.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BrandList;