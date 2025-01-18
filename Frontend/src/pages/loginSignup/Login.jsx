import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and Password are required.');
      return;
    }
    try {
      const response = await axios.post('https://food-delivery-website-i79e.onrender.com/api/auth/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('username', username);  // Store user info (e.g., token or username)
        navigate('/');  // Redirect to a dashboard or home page
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  const navigateToSignup = () => {
    navigate('/signup');  // Navigate to signup page
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
      <div className="input-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="action-buttons">
        <button onClick={handleLogin} className="btn-primary">Login</button>
      </div>

      <div className="signup-container">
        <p>New user? <button onClick={navigateToSignup} className="btn-link">Sign Up</button></p>
      </div>
    </div>
  );
};

export default Login;
