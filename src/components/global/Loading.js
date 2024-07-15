import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loading from "../../images/loading.gif";
import "./global.css";

function Loading() {

  const navigate = useNavigate();
  const code = new URL(document.location.toString()).searchParams.get('code');

  useEffect( () => {
    
    if (code) {
      axios.get(`http://localhost:8080/api/kakao/callback?code=${code}`, {
        withCredentials: true
      }).then( (response) => {
        if (response.data.statusCode === 200) {

          localStorage.setItem("isManager", false);
          localStorage.setItem("accessToken", response.headers.authorization);
        
          navigate("/", {
            state: {
              isLogin: true
            }
          });
        }
      }).catch( (err) => {
        console.log(err);
      });
    }

  }, [code]);

  return (
    <div className="loading">
      <img src={loading} alt="img" />
    </div>
  );
}

export default Loading;