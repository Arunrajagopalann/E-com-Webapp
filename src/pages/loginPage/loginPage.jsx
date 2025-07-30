import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../../styles/loginPage/loginPage.css";
import { useToast } from "../../context/ToastContext";
import "bootstrap/dist/css/bootstrap.min.css";
const LoginSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast(); // This is all we need

  const isSignup = location.pathname === "/signup";

  // State for sign up
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // State for sign in
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSigninChange = (e) => {
    const { name, value } = e.target;
    setSigninData((prev) => ({ ...prev, [name]: value }));
  };

  const API_BASE = process.env.REACT_APP_BASE_URL;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });
      const data = await response.json();
      if (data.statusCode === 200) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        showToast(data.message, "success", () => {
          navigate("/dashboard");
        }); // Show toast using global context
      } else {
        showToast(data.message, "danger", () => {
          console.error("Login error:", data);
        });
      }
    } catch (error) {
      showToast(error.message, "danger", () => {
        console.error("Login error:", error);
      });
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = signupData;

    if (!name || !email || !password || !confirmPassword || !role) {
      showToast("Please fill in all the fields.", "warning", () => {});
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "warning", () => {});
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      await response.json();
      showToast("Signup successful!", "success", () => {
        navigate("/login");
      });
    } catch (error) {
      console.error("Signup error:", error);
      showToast("Signup failed. Please try again.", "danger", () => {
        console.error("Signup error:", error);
      });
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isSignup ? "active" : ""}`}>
        {/* Sign Up Container */}
        <div className="form-container sign-up">
          <div className="form-content">
            <h1>Create Account</h1>
            <span></span>

            {/* Name */}
            <div className="form-group1 mb-3 position-relative">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={signupData.name}
                onChange={handleSignupChange}
                className="form-control beautiful-input pe-5"
                required
              />
              <i className="bi bi-person icon-right"></i>
            </div>

            <div className="form-group1 mb-3 position-relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="form-control beautiful-input pe-5"
                required
              />
              <i className="bi bi-envelope icon-right"></i>
            </div>

            <div className="form-group1 mb-3 position-relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="form-control beautiful-input pe-5"
                required
              />
              <i className="bi bi-lock icon-right"></i>
            </div>

            <div className="form-group1 mb-3 position-relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                className="form-control beautiful-input pe-5"
                required
              />
              <i className="bi bi-lock-fill icon-right"></i>
            </div>

            <div className="form-group1 mb-3 pt-2 position-relative">
              <select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
                required
                className="form-select beautiful-input pe-5"
              >
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Super_Admin">Super Admin</option>
              </select>
              <i className="bi bi-person-badge icon-right"></i>
            </div>
          

            <button onClick={(e) => handleSignUpSubmit(e)}>Sign Up</button>
          </div>
        </div>

        {/* Sign In Container */}
        <div className="form-container sign-in">
          <div className="form-content">
            <h1>Sign In</h1>
            <span></span>

            {/* Email */}
            <div className="form-group1 mb-3 position-relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signinData.email}
                onChange={handleSigninChange}
                className="form-control"
              />
              <i className="bi bi-envelope icon-right"></i>
            </div>

            {/* Password */}
            <div className="form-group1 mb-3 position-relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signinData.password}
                onChange={handleSigninChange}
                className="form-control"
              />
              <i className="bi bi-lock icon-right"></i>
            </div>

            <button onClick={(e) => handleSignInSubmit(e)}>Sign In</button>
          </div>
        </div>

        {/* Toggle Container */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <Link to="/login">
                <button className="hidden">Sign In</button>
              </Link>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all of site features
              </p>
              <Link to="/signup">
                <button className="hidden">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
