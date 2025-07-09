import {React,useEffect,useState} from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom';

function AddCategory() { 
  const navigate= useNavigate()
  const [searchParams] =useSearchParams();
  const id = searchParams.get('id')
  const type = searchParams.get('type')

console.log('id',id)
    const [formData, setFormData] = useState({
        categoryName: '',
        status: "Active"
    });
    const API_BASE = 'http://localhost:8001/api/v1'
    const handleInputChange = (e) => {
        // Handle input changes here
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

 useEffect(() => {
    console.log('type',type,type == 'edit')
    if(type == 'edit'){
   fetchCategories();

    }
  },[type])

   const fetchCategories = async () => {
     try {
      const response = await fetch(`${API_BASE}/category/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
       setFormData({ ...formData, categoryName: data.data.categoryName,status: data.data.status });
      console.log('dataaaaaaaaaa',data,data.data.categoryName)
    //   setCategories(data.data);
    } catch (error) {
      console.error('Login error:', error);
    }
    }
   const handleSubmit = async (e) => {
e.preventDefault();
 try {
  let url = type == 'edit' ? `${API_BASE}/category/${id}` : `${API_BASE}/category`;
  const methodType = (type == 'edit') ? 'PUT' : 'POST';
  const response = await fetch(url, {
    method: methodType,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  const data = await response.json();
  if (data.statusCode === 200) {
    navigate('/category');
  }
  
} catch (error) {
  console.error('Login error:', error);
}
     
   }
    
  return (
    <div>
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input type="text" value={formData.categoryName} name="categoryName" onChange={handleInputChange} required />
        </div> 
        <div>
         
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>
  )
}

export default AddCategory
