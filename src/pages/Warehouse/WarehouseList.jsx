import React from 'react'
import { useNavigate } from 'react-router-dom'

function WarehouseList() {
  const [warehouseList, setWarehouse] = React.useState([]);
  const API_BASE = 'http://localhost:8001/api/v1'
  const navigate = useNavigate()
  
  React.useEffect(() => {
    fetchWarehouse();
  }, [])
  
  const fetchWarehouse = async () => {
    try {
      const response = await fetch(`${API_BASE}/warehouse`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('response', response)
      const data = await response.json();
      setWarehouse(data.data);
    } catch (error) {
      console.error('Fetch Warehouse Error:', error)
    }
  }
  
  return (
    <div>
      <button className="btn btn-primary" onClick={() => navigate('/addWarehouse')}>
        Add Warehouse
      </button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Warehouse Name</th>
            <th scope="col">Type</th>
            <th scope="col">Primary Address</th>
            <th scope="col">POC</th>
            <th scope="col">Stock</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {warehouseList.map((warehouse, index) => (
            <tr key={warehouse._id || index}>
              <th scope="row">{index + 1}</th>
              <td 
                onClick={() => navigate(`/addWarehouse?type=edit&id=${warehouse._id}`)}
                style={{ cursor: 'pointer' }}
              >
                {warehouse.warehouseName}
              </td>
              <td>{warehouse.warehouseType}</td>
              <td>
                {warehouse.address && warehouse.address.length > 0 && 
                  `${warehouse.address[0].addressLine1}, ${warehouse.address[0].city}`
                }
              </td>
              <td>{warehouse.poc}</td>
              <td>{warehouse.stock}</td>
              <td>{warehouse.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WarehouseList;