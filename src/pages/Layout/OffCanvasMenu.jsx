import React from 'react';
import './OffCanvasMenu.css';
import { Link } from 'react-router-dom';

const OffCanvasMenu = ({ isOpen, toggle }) => {
 
  return (
    <div className={`offcanvas-menu ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggle}>×</button>
      <ul>
       <ul>
  <li>
    <Link to="/Brand">Brand</Link>
  </li>
  <li>
    <Link to="/Category">Categories</Link>
  </li>
  <li>
    <Link to="/Warehouse">Warehouse</Link>
  </li>
  <li>
    <Link to="/Product">Product</Link>
  </li>
</ul>
      </ul>
    </div>
  );
};

export default OffCanvasMenu;