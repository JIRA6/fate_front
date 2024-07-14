import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./signup.css";

function Signup() {

  const [signupInfo, setSignupInfo] = useState({
    username: "",
    password: "",
    managerPassword: ""
  });
  const [isManagerCheck, setIsManagerCheck] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleInputValue = (e) => {

    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value
    });

  };

  const handleManagerCheck = () => {
    setIsManagerCheck(!isManagerCheck);
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  const handleSignup = () => {

    if (!signupInfo.username || !signupInfo.password) {
      return setMessage("아이디, 비밀번호를 입력해주세요");
    }

    axios.post(`http://localhost:8080/api/users/signup`, {
      username: signupInfo.username,
      password: signupInfo.password,
      managerPassword: signupInfo.managerPassword
    }).then( (response) => {
      if (response.data.statusCode === 201) {
        navigate("/member/login");
      }
    }).catch( (err) => {
      if (err.response.data.statusCode === 400) {
        return setMessage("입력값을 확인해주세요");
      }

      if (err.response.data.statusCode === 409) {
        return setMessage("사용 중인 아이디입니다");
      }
    });

  };

  return (
    <div className="signup-component">
      <h2>회원가입</h2>

      <div className="signup-component-input">
        <input
          name="username"
          placeholder="아이디를 입력해주세요"
          onChange={handleInputValue} 
          onKeyDown={handleEnterKey} />
      </div>

      <div className="signup-component-input">
        <input
          name="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          onChange={handleInputValue} 
          onKeyDown={handleEnterKey} />
      </div>

      <div className="signup-component-checkbox">
        <label>
          <input 
            type="checkbox"
            checked={isManagerCheck}
            onChange={handleManagerCheck} />
          매니저
        </label>
      </div>

      {isManagerCheck && (
        <div className="signup-component-input">
          <input
            name="managerPassword"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            onChange={handleInputValue} 
            onKeyDown={handleEnterKey} />
        </div>
      )}

      {message && (
        <div className="signup-component-error-message">{message}</div>
      )}

      <div className="signup-component-footer">
        <Link to="/member/login">로그인</Link>
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
}

export default Signup;