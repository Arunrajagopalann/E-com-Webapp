import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  validateEmail, 
  validatePassword, 
  validateMobile, 
  validateName,
  getPasswordStrength,
  formatFormData,
  logToConsole 
} from '../../utils/helper';
import '../../styles/loginPage/loginPage.css';

const LoginSignup = () => {
  const { login, signup, loading, error, clearError, isAuthenticated, logout } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');

  // Clear errors when switching between forms
  useEffect(() => {
    clearError();
    setErrors({});
    setTouched({});
  }, [isSignup, clearError]);

  // Update password strength when password changes
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    } else {
      setPasswordStrength('');
    }
  }, [formData.password]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input blur (for validation)
  const handleInputBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let fieldError = '';
    
    switch (fieldName) {
      case 'name':
        if (isSignup && !validateName(value)) {
          fieldError = 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          fieldError = 'Please enter a valid email address';
        }
        break;
      case 'mobile':
        if (isSignup && !validateMobile(value)) {
          fieldError = 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          fieldError = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }
        break;
      case 'confirmPassword':
        if (isSignup && value !== formData.password) {
          fieldError = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldError
    }));
    
    return !fieldError;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    
    if (isSignup) {
      if (!validateName(formData.name)) {
        newErrors.name = 'Name must be at least 2 characters long';
      }
      if (!validateMobile(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    logToConsole('FORM_SUBMISSION', { 
      type: isSignup ? 'signup' : 'login', 
      email: formData.email 
    });
    
    if (!validateForm()) {
      logToConsole('FORM_VALIDATION_FAILED', errors);
      return;
    }
    
    try {
      if (isSignup) {
        const userData = formatFormData({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password
        });
        
        await signup(userData);
        logToConsole('SIGNUP_SUCCESS', { email: formData.email, name: formData.name });
        
      } else {
        const credentials = formatFormData({
          email: formData.email,
          password: formData.password
        });
        
        await login(credentials);
        logToConsole('LOGIN_SUCCESS', { email: formData.email });
      }
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      logToConsole('FORM_SUBMISSION_ERROR', error.message);
    }
  };

  // Handle panel switching
  const handlePanelSwitch = (isSignupPanel) => {
    setIsSignup(isSignupPanel);
    clearError();
    setErrors({});
    setTouched({});
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'strong': return '#00aa00';
      default: return '#ccc';
    }
  };

  return (
    <div className={`container ${isSignup ? 'right-panel-active' : ''}`}>
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.name && errors.name ? 'error' : ''}
          />
          {touched.name && errors.name && <span className="error-text">{errors.name}</span>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.email && errors.email ? 'error' : ''}
          />
          {touched.email && errors.email && <span className="error-text">{errors.email}</span>}
          
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.mobile && errors.mobile ? 'error' : ''}
          />
          {touched.mobile && errors.mobile && <span className="error-text">{errors.mobile}</span>}
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.password && errors.password ? 'error' : ''}
          />
          {touched.password && errors.password && <span className="error-text">{errors.password}</span>}
          {formData.password && (
            <div className="password-strength">
              <span>Password strength: </span>
              <span style={{ color: getPasswordStrengthColor() }}>
                {passwordStrength}
              </span>
            </div>
          )}
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
          />
          {touched.confirmPassword && errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.email && errors.email ? 'error' : ''}
          />
          {touched.email && errors.email && <span className="error-text">{errors.email}</span>}
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={touched.password && errors.password ? 'error' : ''}
          />
          {touched.password && errors.password && <span className="error-text">{errors.password}</span>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Overlay Container */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>To stay connected, please login with your personal info</p>
            <button className="ghost" onClick={() => handlePanelSwitch(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Enter your details and start your journey with us</p>
            <button className="ghost" onClick={() => handlePanelSwitch(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Success Message for Demo */}
      {isAuthenticated && (
        <div className="success-message">
          Welcome! You are now logged in.
          <button onClick={() => logout()} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
