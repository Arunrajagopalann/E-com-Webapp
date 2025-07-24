import React from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css"; // Import the CSS

function CatagoryList() {
  const [categories, setCategories] = React.useState([]);
  const API_BASE = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) setCategories(data.data);
      else setCategories([]);
    } catch (error) {
      console.error("Fetch Category Error:", error);
    }
  };

  const deleteCategory = async (_id) => {
    if (!accessToken) {
      alert("Unauthorized: Please log in.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/category/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        alert(data.message || "Delete failed.");
        return;
      }
      fetchCategories();
    } catch (error) {
      alert("Error deleting category.");
      console.error("Delete Category Error:", error);
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
