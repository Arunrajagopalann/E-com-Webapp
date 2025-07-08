import React, { useState } from 'react';
import OffCanvasMenu from './Layout/OffCanvasMenu';
import Header from './Layout/Header';

const DashboardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="dashboard">
      <OffCanvasMenu isOpen={isOpen} toggle={toggleMenu} />
      <div className={`main-content ${isOpen ? 'shifted' : ''}`}>
        <Header toggle={toggleMenu} />
        <div className="table-controls">
          <input type="text" placeholder="Search..." />
          <button className="filter-btn">Filter</button>
          <button className="refresh-btn">⟳</button>
          <button className="create-btn">Create User</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Name</th>
              <th>User Type</th>
              <th>Email ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>Kumar</td>
              <td>User</td>
              <td>example@gmail.com</td>
            </tr>
            <tr>
              <td>02</td>
              <td>Ajith Kumar</td>
              <td>Admin</td>
              <td>sample@gmail.com</td>
            </tr>
          </tbody>
        </table>
        <div className="pagination">01–20 of 27 Rows per page: 20 ◀ ▶</div>
      </div>
    </div>
  );
};

export default DashboardPage;