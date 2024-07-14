import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Login() {
  
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleInputValue = (e) => {

    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value
    });

  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  const handleLogin = async () => {

    if (!loginInfo.username || !loginInfo.password) {
      return setMessage("아이디, 비밀번호를 모두 입력해주세요");
    }

    axios.post(`http://localhost:8080/api/users/login`, {
      username: loginInfo.username,
      password: loginInfo.password
    }, {
      withCredentials: true
    }).then( (response) => {
      if (response.data.statusCode === 200) {

        localStorage.setItem("accessToken", response.headers.authorization);

        setMessage("");

        navigate("/", {
          state: {
            isLogin: true
          }
        });
      }
    }).catch( (err) => {
      if (err.response.data.statusCode === 400) {
        setMessage("아이디, 비밀번호를 확인해주세요");
      }
    });

  };
  
  return (
    <div className="login-component">
      <h2>로그인</h2>

      <div>
        <input
          name="username"
          placeholder="아이디를 입력해주세요"
          onChange={handleInputValue} 
          onKeyDown={handleEnterKey} />
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          onChange={handleInputValue} 
          onKeyDown={handleEnterKey} />
      </div>

      {message ? <div className="login-component-error-message">{message}</div> : null}

      <div className="login-component-footer">
        <Link to="/member/signup">회원가입</Link>
        <button onClick={handleLogin}>로그인</button>
      </div>

    </div>
  );
}

export default Login;