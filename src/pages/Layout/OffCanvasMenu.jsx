import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./OffCanvasMenu.css";
import { Outlet, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const OffCanvasMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [title, setTitle] = useState("");

  const location = useLocation();
  console.log("location", location);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    handleSetTitle();
  }, [location.pathname]);

  const handleSetTitle = () => {
    const pathname = location.pathname;
    if (pathname.startsWith("/dashboard")) {
      setTitle("Dashboard");
    } else if (pathname.startsWith("/brand")) {
      setTitle("Brand");
    } else if (pathname.startsWith("/category")) {
      setTitle("Category");
    } else if (pathname.startsWith("/product")) {
      setTitle("Product");
    } else if (pathname.startsWith("/warehouse")) {
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
    {
      name: "My Profile",
      link: "myprofile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076q.188-.245.36-.502A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.96 9.96 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22q.324 0 .644-.02a9.95 9.95 0 0 0 5.031-1.745a10 10 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="d-flex" id="wrapper">
      <div
        className={`border-end ${isCollapsed ? "collapsed" : ""}`}
        id="sidebar-wrapper"
      >
        <div
          className={`d-flex px-3 py-2 sidebar-heading  ${isCollapsed ? "justify-content-center" : "justify-content-between"} align-items-center`}
          style={{ justifySelf: "center" }}
        >
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
            <span
              className="navbar-brand mb-0 h4"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
                fontWeight: "600",
              }}
            >
              {title}
            </span>
            <div className="d-flex align-items-center gap-3">
              <div className="dropdown">
                <button
                  className="btn position-relative"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  data-bs-toggle="dropdown"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                  >
                    <path
                      fill="currentColor"
                      d="M11.997 21.385q-.668 0-1.14-.475q-.472-.474-.472-1.14h3.23q0 .67-.475 1.143q-.476.472-1.143.472M5.5 18.769q-.213 0-.356-.144T5 18.268t.144-.356t.356-.143h1.116V9.846q0-1.96 1.24-3.447T11 4.546V4q0-.417.291-.708q.291-.292.707-.292t.709.292T13 4v.075q-.442.616-.683 1.342q-.24.727-.24 1.487q0 1.998 1.395 3.422t3.374 1.463h.27q.134 0 .268-.02v6H18.5q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm11.464-9.365q-1.041 0-1.772-.729t-.73-1.769t.728-1.772t1.77-.73t1.77.728t.732 1.77t-.729 1.771t-1.77.73"
                    />
                  </svg>
                  <span
                    className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                    style={{ boxShadow: "0 0 5px rgba(220, 53, 69, 0.5)" }}
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#5fc3e4",
                        }}
                      ></div>
                      New Message
                    </span>
                  </li>
                  <li>
                    <span className="dropdown-item d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#667eea",
                        }}
                      ></div>
                      Task Due
                    </span>
                  </li>
                  <li>
                    <span className="dropdown-item d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#5fc3e4",
                        }}
                      ></div>
                      Server Update
                    </span>
                  </li>
                </ul>
              </div>

              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-3"
                  data-bs-toggle="dropdown"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "linear-gradient(135deg, #667eea, #5fc3e4)", // Gradient matching the theme
                      color: "white",
                      border: "2px solid #ffffff",
                      fontSize: "18px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px rgba(95, 195, 228, 0.3)",
                    }}
                  >
                    A
                  </div>
                  <div
                    className="text-start d-none d-md-block"
                    style={{ color: "white" }}
                  >
                    <div className="fw-semibold">Admin</div>
                    <div className="small" style={{ opacity: 0.9 }}>
                      Store Manager
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    style={{ color: "white" }}
                  >
                    <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                  </svg>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2"
                      href="#"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#667eea"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08c1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"
                        />
                      </svg>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2"
                      href="#"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#5fc3e4"
                          d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z"
                        />
                      </svg>
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item d-flex align-items-center gap-2"
                      href="/"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#dc3545"
                          d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                        />
                      </svg>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div className="container-fluid p-0 dash-sidebar-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OffCanvasMenu;
