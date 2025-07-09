import {React,useState} from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import OffCanvasMenu from './OffCanvasMenu'
import { Cursor } from "mongoose";
const Header = ({ toggle }) => {
  const navigate = useNavigate();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <div className="header">
      <div
        onClick={toggleMenu}
        style={{ cursor: "pointer" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 18v-2h18v2zm0-5v-2h18v2zm0-5V6h18v2z"/>
        </svg>
      </div>
      <OffCanvasMenu isOpen={isMenuOpen} toggle={toggleMenu} />
      <h2>User View</h2>
      <button className="header-right" onClick={() => navigate("/Login")}>
        Logout
      </button>
    </div>
  );
};

export default Header;
