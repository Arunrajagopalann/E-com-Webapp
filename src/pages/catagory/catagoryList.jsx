import React from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css"; // Import the CSS

function CatagoryList() {
  const [categories, setCategories] = React.useState([]);
  const API_BASE = "http://localhost:8001/api/v1";
  const navigate = useNavigate();
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("response", response);
      const data = await response.json();

      setCategories(data.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/category/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("data", data);
      fetchCategories();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-title">Category Management</h1>
        <button className="btn-add" onClick={() => navigate("/addCategory")}>
          Add Category
        </button>
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Category Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id || index}>
                <td>{index + 1}</td>
                <td>{category.categoryName}</td>
                <td>
                  <span
                    className={`status-badge ${
                      category.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/addCategory?type=edit&id=${category._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CatagoryList;
