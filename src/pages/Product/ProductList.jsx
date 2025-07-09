import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProductList() {
  const [products, setProducts] = React.useState([]);
  const API_BASE = 'http://localhost:8000/api/v1'
  const navigate = useNavigate()

  React.useEffect(() => {
    fetchProducts();
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/addProduct')}>Add Product</button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Product Name</th>
            <th scope="col">Price</th>
            <th scope="col">Seller</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.seller}</td>
              <td>{product.status}</td>
              <td>
                <button className="btn btn-secondary" onClick={() => navigate(`/addProduct?type=edit&id=${product._id}`)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList;