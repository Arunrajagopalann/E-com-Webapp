import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OffCanvasMenu.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import DashboardCharts from "../Layout/DashboardCharts";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
 const API_BASE = process.env.REACT_APP_BASE_URL;
  const accessToken = localStorage.getItem("accessToken");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
 const [userDetails, setUserDetails] = useState("");
 const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location", location);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("UserId");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/UserProfile");
    closeProfileDropdown();
  };

  const handleMessageClick = () => {
    // Navigate to messages page or show message modal
    console.log("Message clicked");
    closeProfileDropdown();
  };

  const handleSetTitle = () => {
    const pathname = location.pathname;
    if (pathname.startsWith("/dashboard")) {
      setTitle("Dashboard");
    } else if (pathname.startsWith("/brand") || pathname.startsWith("/addBrand")) {
      setTitle("Brand");
    } else if (pathname.startsWith("/category") || pathname.startsWith("/addCategory")) {
      setTitle("Category");
    } else if (pathname.startsWith("/product") || pathname.startsWith("/addProduct")) {
      setTitle("Product");
    } else if (pathname.startsWith("/warehouse") || pathname.startsWith("/addWarehouse")) {
      setTitle("Warehouse");
    } else if (
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup")
    ) {
      setTitle("Welcome");
    } else {
      setTitle("Page Not Found");
    }
  };

 const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log("User Data:", data);
      if (response.status === 200) {
        setUserDetails(data.data);
        localStorage.setItem("UserId",data.data._id);
      } else {
      }
    } catch (error) {
      console.error("Fetch Warehouse Error:", error);
    } finally {
    }
  };

    useEffect(() => {
    handleSetTitle();
  }, [location.pathname]);

  // Mock fetch function to simulate getting dashboard stats
  useEffect(() => {
    const fetchData = async () => {
      // Simulate an API call
      const data = {
        salesOverview: [1200, 1900, 1500, 2400, 2700, 1700],
        topProducts: [
          "Product A",
          "Product B",
          "Product C",
          "Product D",
          "Product E",
        ],
        salesByCategory: [25, 40, 15, 20],
        customerInsights: [63, 25, 12],
      };
      setDashboardStats(data);
    };

    fetchData();
     fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        closeProfileDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  if (!dashboardStats) {
    return <div>Loading...</div>;
  }

  
  const menuItems = [
    {
      name: "Dashboard",
      link: "dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2.954a10 10 0 0 1 6.222 17.829A1 1 0 0 1 17.6 21H6.4a1 1 0 0 1-.622-.217A10 10 0 0 1 12 2.954m4.207 5.839a1 1 0 0 0-1.414 0l-2.276 2.274a2.003 2.003 0 0 0-2.514 1.815L10 13a2 2 0 1 0 3.933-.517l2.274-2.276a1 1 0 0 0 0-1.414"
          />
        </svg>
      ),
    },
    {
      name: "Brand",
      link: "brand",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"
          />
          <path
            fill="currentColor"
            d="M2.08 9.75h19.84v.578c0 1.776 0 3.255-.19 4.446c-.198 1.238-.63 2.34-1.571 3.281c-.94.94-2.043 1.373-3.28 1.571c-1.192.19-2.67.19-4.447.19h-1.864c-1.776 0-3.255 0-4.446-.19c-1.238-.198-2.34-.63-3.281-1.571c-.94-.94-1.373-2.043-1.571-3.28c-.19-1.192-.19-2.67-.19-4.447z"
          />
        </svg>
      ),
    },
    {
      name: "Category",
      link: "category",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12.78 4h8.22v8.22l-8.22-8.22zm-1.56 0L4 11.22V4h7.22zM4 12.78L11.22 20H4v-7.22zm16.22 0V20h-7.22l7.22-7.22z"
          />
        </svg>
      ),
    },
    {
      name: "Product",
      link: "product",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M21.993 7.95a.96.96 0 0 0-.029-.214c-.007-.025-.021-.049-.03-.074c-.021-.057-.04-.113-.07-.165c-.016-.027-.038-.049-.057-.075c-.032-.045-.063-.091-.102-.13c-.023-.022-.053-.04-.078-.061c-.039-.032-.075-.067-.12-.094c-.004-.003-.009-.003-.014-.006l-.008-.006l-8.979-4.99a1.002 1.002 0 0 0-.97-.001l-9.021 4.99c-.079.044-.147.098-.219.158c-.05.035-.106.06-.151.1c-.087.08-.155.175-.21.275c-.067.12-.105.249-.124.385c-.002.016-.008.027-.008.041V16.95c0 .383.22.735.566.902l8.981 4.992l.016.008l.013.003l.015.005c.163.078.34.115.516.115s.354-.037.517-.115l.015-.005l.013-.003l.016-.008l8.981-4.992c.347-.167.566-.519.566-.902V7.95zm-9.993 5.467l-7.071-3.935L12 5.512l7.071 3.934zm-7.983 2.906V11.21l7 3.89v7.118zm9 0l-7-3.89v7.119z"
          />
        </svg>
      ),
    },
    {
      name: "Warehouse",
      link: "warehouse",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M22 19V9L12 3L2 9v10h2v-9.074l8-4.382l8 4.382V19zM11 10h2v5h-2zm-5 5h2v-3H6zm8 0h4v-3h-4z"
          />
          <path fill="currentColor" d="m4 21l4-4h8l4 4z" />
        </svg>
      ),
    },
    // {
    //   name: "My Profile",
    //   link: "UserProfile",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         fill="currentColor"
    //         fillRule="evenodd"
    //         d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076q.188-.245.36-.502A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.96 9.96 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22q.324 0 .644-.02a9.95 9.95 0 0 0 5.031-1.745a10 10 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
    //         clipRule="evenodd"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  return (
    <>
     {/* <div className="dashboard">
      <h1>Dashboard</h1>
       <DashboardCharts dashboardStats={dashboardStats} />
      <Outlet />
     </div> */}

     <div className="d-flex" id="wrapper">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={closeMobileMenu}
        />
      )}
      
      <div
        className={`border-end ${isCollapsed ? "collapsed" : ""} ${isMobileMenuOpen ? "mobile-open" : ""}`}
        id="sidebar-wrapper"
      >
        <div
          className={`d-flex px-3 py-2 sidebar-heading ${isCollapsed ? "justify-content-center" : "justify-content-between"} align-items-center`}
          style={{ justifySelf: "center" }}
        >
          {/* Mobile Close Button */}
          <button
            className="btn d-lg-none mobile-close-btn"
            onClick={closeMobileMenu}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "14px",
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1002,
            }}
          >
            ✕
          </button>
          <div
            style={{
              height: "48px",
              width: isCollapsed ? "48px" : "150px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to right, #667eea, #5fc3e4)", // Gradient theme
              color: "white",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: isCollapsed ? "16px" : "14px",
              boxShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
            }}
            onClick={toggleSidebar}
          >
            {isCollapsed ? "E" : "E-Commerce"}
          </div>
          {/* <img
  src={logo}
  alt="Logo"
  style={{ height: '48px', cursor: 'pointer', transition: 'all 0.2s ease' }}
  onClick={toggleSidebar}
/> */}

          {/* {!isCollapsed && (
            <button className="btn btn-sm d-flex align-items-center gap-2" onClick={toggleSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
                />
              </svg>
            </button>
          )} */}
        </div>

        <div className="list-group list-group-flush">
          {menuItems.map((item, index) => (
            <Link
              to={`/${item.link}`}
              key={index}
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={closeMobileMenu}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </div>

      <div id="page-content-wrapper" className="w-100">
        <nav className="navbar navbar-expand-lg navbar-light border-bottom px-3 py-2 w-100">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Mobile Menu Toggle */}
            <button
              className="btn d-lg-none mobile-menu-toggle"
              onClick={toggleMobileMenu}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            
            <span
              className="navbar-brand mb-0 h4"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
                fontWeight: "600",
              }}
            >
              {title}
            </span>
            
            {/* Profile Dropdown */}
            <div className="profile-dropdown-container position-relative">
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={toggleProfileDropdown}
                style={{
                  minWidth: 'auto',
                  padding: '8px 16px',
                  fontSize: '14px',
                  borderRadius: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076q.188-.245.36-.502A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.96 9.96 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22q.324 0 .644-.02a9.95 9.95 0 0 0 5.031-1.745a10 10 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
                    clipRule="evenodd"
                  />
                </svg>
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap',
                  maxWidth: '120px'
                }}>
                  {userDetails?.name || 'Profile'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{
                    transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                  }}
                >
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="dropdown-menu show">
                  <div
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: '#667eea' }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076q.188-.245.36-.502A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.96 9.96 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22q.324 0 .644-.02a9.95 9.95 0 0 0 5.031-1.745a10 10 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>My Profile</span>
                  </div>
                  
                  <div
                    className="dropdown-item"
                    onClick={handleMessageClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: '#667eea' }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <span>Messages</span>
                  </div>
                  
                  <div
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: '#dc3545' }}
                    >
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    <span style={{ color: '#dc3545' }}>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container-fluid p-0 dash-sidebar-content">
          <Outlet />
        </div>
      </div>
    </div>
    </>

  );
};

export default Dashboard;
//offCanvas.jsx