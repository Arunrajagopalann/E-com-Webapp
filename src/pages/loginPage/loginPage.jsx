import React, { useState } from 'react';
import '../../styles/loginPage/loginPage.css'

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className={`container ${isSignup ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <form>
          <h2>Create Account</h2>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Mobile Number" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <button>Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form>
          <h2>Sign in</h2>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>To stay connected, please login with your personal info</p>
            <button className="ghost" onClick={() => setIsSignup(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Enter your details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsSignup(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default LoginSignup;
