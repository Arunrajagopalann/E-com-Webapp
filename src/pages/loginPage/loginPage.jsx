import React, { useState } from 'react';
import { useLocation, Link,useNavigate } from 'react-router-dom';
import '../../styles/loginPage/loginPage.css';

const LoginSignup = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
const navigate = useNavigate();
  // State for sign up
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  // State for sign in
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
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

  const API_BASE =process.env.REACT_APP_API_BASE;
console.log('API_BASE',API_BASE)


  const handleSignInSubmit = async (e) => {
    console.log('signupData',signupData)
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData)
      });
      const data = await response.json();
      navigate("/dashboard")
      console.log('Login response:', data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await response.json();
      console.log('Signup response:', data);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="login-page">
      <div className={`container ${isSignup ? 'active' : ''}`}>

        {/* Sign Up Container */}
        <div className="form-container sign-up">
          <div className="form-content">
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input type="text" name="name" placeholder="Name" value={signupData.name} onChange={handleSignupChange} />
            <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
            <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} />
            <select className="role-select" name="role" value={signupData.role} onChange={handleSignupChange}>
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="guest">Guest</option>
            </select>
            <button onClick={handleSignUpSubmit}>Sign Up</button>
          </div>
        </div>

        {/* Sign In Container */}
        <div className="form-container sign-in">
          <div className="form-content">
            <h1>Sign In</h1>
            <span>or use your email password</span>
            <input type="email" name="email" placeholder="Email" value={signinData.email} onChange={handleSigninChange} />
            <input type="password" name="password" placeholder="Password" value={signinData.password} onChange={handleSigninChange} />
            <button type="button" className="forgot-password">Forget Your Password?</button>
            <button onClick={handleSignInSubmit}>Sign In</button>
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
              <p>Register with your personal details to use all of site features</p>
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
