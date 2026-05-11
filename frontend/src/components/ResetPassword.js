import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, { password });
      alert("Password updated successfully!");
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Token invalid or expired');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>NEW PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>CONFIRM PASSWORD</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button">UPDATE PASSWORD</button>
        </form>
        {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;