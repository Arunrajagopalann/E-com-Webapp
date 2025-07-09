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
  const deleteBrand = async (_id) => {
    try {
      const response = await fetch(`${API_BASE}/brand/${_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('response', response)
      const data = await response.json();
      fetchBrand();
    } catch (error) {
      console.error('Delete Brand Error:', error)
    }
  }
  
  return (
   
              <div className="card p-5 m-4" >

            {/* <div className='container  py-2' > */}
                 <div className='row justify-content-end' >
<div className='col-3 text-end' >
 <button className="btn btn-primary" onClick={() => navigate('/addBrand')}>
        Add Brand
      </button>
            </div>
            </div>
            {/* </div> */}
     
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
               <button onClick={()=>{deleteBrand(brand._id)}}>Delete</button>
            </tr>
            

          ))}
        </tbody>
      </table>
          </div>
         
      
   
  )
}

export default BrandList;