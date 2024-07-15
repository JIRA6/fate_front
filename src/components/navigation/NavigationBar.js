import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navigationbar.css'; // 필요한 스타일을 포함

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isManager');
    navigate('/login');
  };

  return (
      <nav className="navigation-bar">
        <div className="nav-logo">
          <Link to="/">로고</Link>
        </div>
        <div className="nav-links">
          <Link to="/">메인</Link>
          <Link to="/member">회원가입</Link>
        </div>
        <div className="nav-actions">
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </nav>
  );
};

export default NavigationBar;
