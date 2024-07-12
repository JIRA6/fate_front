import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('mode') === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
      <div className="auth-page">
        <div className="auth-container">
          {isLogin ? (
              <div className="auth-form">
                <h2>로그인</h2>
                <form onSubmit={handleAuth}>
                  <label>
                    아이디:
                    <input type="text" name="id" />
                  </label>
                  <label>
                    비밀번호:
                    <input type="password" name="password" />
                  </label>
                  <button type="submit">로그인</button>
                </form>
              </div>
          ) : (
              <div className="auth-form">
                <h2>회원가입</h2>
                <form onSubmit={handleAuth}>
                  <label>
                    아이디:
                    <input type="text" name="id" />
                  </label>
                  <label>
                    비밀번호:
                    <input type="password" name="password" />
                  </label>
                  <div className="admin-check">
                    <label>
                      관리자:
                      <input type="checkbox" name="admin" onChange={(e) => setIsAdmin(e.target.checked)} />
                    </label>
                    {isAdmin && (
                        <label>
                          관리자 암호:
                          <input type="password" name="adminPassword" />
                        </label>
                    )}
                  </div>
                  <button type="submit">회원가입</button>
                </form>
              </div>
          )}
        </div>
      </div>
  );
};

export default AuthPage;
