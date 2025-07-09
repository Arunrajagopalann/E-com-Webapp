import React, { useState } from 'react';
import OffCanvasMenu from '../pages/Layout/OffCanvasMenu'

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <div>
    {/* //    Toggle Button
    //    <button className="btn btn-primary m-3" onClick={toggleMenu}>
    //      ☰ Menu
    //    </button>

    //    {/* OffCanvas Sidebar */}
    {/* //    <OffCanvasMenu isOpen={isMenuOpen} toggle={toggleMenu} />

    //    {/* Dashboard Content */}
    {/* //    <div className="container mt-4">
    //      <h2>Welcome to the Dashboard</h2>
    //      {/* Your dashboard cards, charts, stats, etc. */}
    {/* //    </div> */} 
    </div>
  );
};

export default Dashboard;
