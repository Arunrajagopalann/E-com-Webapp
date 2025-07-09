
import React from 'react'
import { useNavigate } from 'react-router-dom';

function CatagoryList() {
  const [categories, setCategories] = React.useState([]);
  const API_BASE = 'http://localhost:8001/api/v1'
  const navigate= useNavigate()
  React.useEffect(() => {
   fetchCategories();
  },[])

   const fetchCategories = async () => {
     try {
      const response = await fetch(`${API_BASE}/category`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('response',response)
      const data = await response.json();

      setCategories(data.data);
    } catch (error) {
      console.error('Login error:', error);
    }
    }


    const deleteCategory = async (id) => {
      try {
        const response = await fetch(`${API_BASE}/category/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log('data',data)
        fetchCategories()
      } catch (error) {
        console.error('Login error:', error);
      }
      }
  return (
    <div>

      <button className= "btn btn-primary" onClick ={()=>navigate('/addCategory')}>Add catagory</button>
      <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col" >categoryName</th>
      <th scope="col">status</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
    {categories.map((category, index) => (
      <tr key={index}>
        <th scope="row">{index + 1}</th>
        <td onClick ={()=>navigate(`/addCategory?type=edit&id=${category._id}`)}>{category.categoryName}</td>
        <td>{category.status}</td>
        <td><button className='btn btn-danger' onClick={()=>deleteCategory(category._id)}>Del</button></td>
      </tr>
    ))}
  </tbody>

</table>
    </div>
  )
}

export default CatagoryList
