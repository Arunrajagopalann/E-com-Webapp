import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import Swal from "sweetalert2";
import ToastMessage from "../../components/ToastMessage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
function CatagoryList() {
  const [categories, setCategories] = React.useState([]);
  const API_BASE = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryList, setCategoryList] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Add this missing state
  const [totalCategories, setTotalCategories] = useState(0); // Add this missing state
  const itemsPerPage = 3; // Add this for pagination
  const totalPages = Math.ceil(totalCategories / itemsPerPage);
  React.useEffect(() => {
    fetchCategories("categories", categories);
  }, []);

  const updateDisplayCategories = (categories, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, categories.length);
    console.log(
      `Displaying categories from index ${startIndex} to ${endIndex}`
    );
    setCategoryList(categories.slice(startIndex, endIndex));
  };

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update displayed categories when page changes
  useEffect(() => {
    if (allCategories.length > 0) {
      updateDisplayCategories(allCategories, currentPage);
    }
  }, [currentPage, allCategories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      // Fix if/else structure with proper curly braces
      if (response.status === 200) {
        setAllCategories(data.data);
        setTotalCategories(data.data.length);
        updateDisplayCategories(data.data, currentPage);
      } else {
        setCategoryList([]);
        setAllCategories([]);
        setTotalCategories(0);
      }
    } catch (error) {
      console.error("Fetch Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    Swal.fire({
      title: "Do you want to delete this?",
      showCancelButton: true,
      confirmButtonText: "Ok",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE}/category/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const result = await response.json();

          if (result.statusCode === 200) {
            Swal.fire({
              title: result.message || "Category deleted successfully",
              icon: "success",
            }).then(async (result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                fetchCategories();
              }
            });
          } else {
            Swal.fire({
              title: result.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Delete category error:", error);
        } finally {
          setLoading(false);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
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
            {categoryList.length > 0 ? (
              categoryList.map((category, index) => (
                <tr key={category._id || index}>
                  <td data-label="S.No">{index + 1}</td>
                  <td data-label="Category Name">{category.categoryName}</td>
                  <td data-label="Status">
                  <span
                    className={`status-badge ${
                      category.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td data-label="Actions" className="action-buttons">
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
                ))
              ) : (
                <tr>
                  <td colSpan="4">No brands found</td>
                </tr>
              )}
            </tbody>
        </table>
        <div>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              {/* Previous Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  &laquo;
                </button>
              </li>

              {/* Dynamic Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              {/* Next Button */}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default CatagoryList;
