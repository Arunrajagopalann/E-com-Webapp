import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../../styles/loginPage/loginPage.css";

const LoginSignup = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const navigate = useNavigate();
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

  const API_BASE = process.env.REACT_APP_BASE_URL || 'http://localhost:8001/api/v1'

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', signinData);
    console.log('API URL:', `${API_BASE}/login`);
    
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert(errorData.message || 'Login failed. Please check your credentials.');
        return;
      }
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if(data.statusCode === 200){
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        alert('Login successful!');
        navigate("/dashboard");
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('Network error. Please check if the server is running and try again.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting signup with:', signupData);
    console.log('API URL:', `${API_BASE}/register`);
    
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup failed:', errorData);
        alert(errorData.message || 'Signup failed. Please try again.');
        return;
      }
      
      const data = await response.json();
      console.log('Signup response:', data);
      
      if (response.ok) {
        alert("Account created successfully! Please sign in.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Network error. Please check if the server is running and try again.");
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isSignup ? "active" : ""}`}>
        {/* Sign Up Container */}
        <div className="form-container sign-up">
          <div className="form-content">
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={signupData.name}
              onChange={handleSignupChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
            />
            <select
              className="role-select"
              name="role"
              value={signupData.role}
              onChange={handleSignupChange}
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Super_Admin">Super Admin</option>
              {/* <option value="guest">Guest</option> */}
            </select>
            <button onClick={handleSignUpSubmit}>Sign Up</button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Already have an account?{' '}
              </span>
              <Link 
                to="/login" 
                style={{ 
                  color: '#2da0a8', 
                  textDecoration: 'none', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Sign In Container */}
        <div className="form-container sign-in">
          <div className="form-content">
            <h1>Sign In</h1>
            <span>or use your email password</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signinData.email}
              onChange={handleSigninChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signinData.password}
              onChange={handleSigninChange}
            />
            <button type="button" className="forgot-password">
              Forget Your Password?
            </button>
            <button onClick={handleSignInSubmit}>Sign In</button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>
                Don't have an account?{' '}
              </span>
              <Link 
                to="/signup" 
                style={{ 
                  color: '#2da0a8', 
                  textDecoration: 'none', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Sign Up
              </Link>
            </div>
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
