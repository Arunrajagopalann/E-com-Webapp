import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggle }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <button className="menu-btn" onClick={toggle}>☰</button>
      <h2>User View</h2>
      <button className="header-right"onClick={()=>navigate('/Login')}>Logout</button>
    </div>
  );
};

export default Header;