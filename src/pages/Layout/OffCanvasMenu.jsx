import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const OffCanvasMenu = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`offcanvas offcanvas-start ${isOpen ? "show" : ""}`}
      tabIndex="-1"
      style={{
        visibility: isOpen ? "visible" : "hidden",
        backgroundColor: "white",
        zIndex: 1045, // Make sure it stacks properly
      }}
    >
      <div className="offcanvas-header">
        <h5
          className="offcanvas-title"
          onClick={() => {
            navigate("/dashboard");
            toggle(); // Close the menu after navigation
          }}
          style={{ cursor: "pointer" }}
        >
          Menu
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          onClick={toggle}
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/Brand" onClick={toggle}>
              Brand
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Category" onClick={toggle}>
              Categories
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Warehouse" onClick={toggle}>
              Warehouse
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Product" onClick={toggle}>
              Product
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OffCanvasMenu;
