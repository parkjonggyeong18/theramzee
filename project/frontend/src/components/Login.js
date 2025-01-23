// Login.js 수정
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 실제 로그인 로직 추가
    navigate('/lobby');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="background-gif"></div>
      <h1 className="title">THE RAMZEE STORY</h1>
      
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="ID" 
            className="login-input"
          />
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="PASSWORD" 
            className="login-input"
          />
          
          <div className="button-group">
            <button type="submit" className="login-btn">LOG IN</button>
            <button type="button" className="forgot-btn">FORGOT IT?</button>
          </div>
          
          <button type="button" className="register-btn">REGISTER</button>
        </form>
      </div>
    </div>
  );
};

export default Login;