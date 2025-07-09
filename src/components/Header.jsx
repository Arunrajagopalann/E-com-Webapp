import { React, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import OffCanvasMenu from "./OffCanvasMenu";

const Header = ({ toggle }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <div className="header">
        <div
          onClick={toggleMenu}
          style={{ cursor: "pointer" }}
          className="menu-toggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z"
            />
          </svg>
        </div>
        <OffCanvasMenu isOpen={isMenuOpen} toggle={toggleMenu} />
        <h2>User View</h2>
        <button className="header-right" onClick={() => navigate("/Login")}>
          Logout
        </button>
      </div>

      {/* Welcome Card */}
      <div className="welcome-card-container">
        <div className="welcome-card">
          <div className="welcome-card-body">
            <div className="welcome-card-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#667eea"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
            </div>
            <div className="welcome-content">
              <h3>Welcome to your Dashboard</h3>
              <p>
                Access all your important tools and information from this
                central location.
              </p>
              <div className="action-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate("/products")}
                >
                  Products
                </button>
                <button
                  className="btn-outline"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
