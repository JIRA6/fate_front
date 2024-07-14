import { useParams, Link } from "react-router-dom";
import Login from "../../components/member/Login";
import Signup from "../../components/member/Signup";
import "./member.css";

function Member() {

  const params = useParams();

  return (
    <>
      {params.id === "login" || params.id === "signup" 
      ? <div className="member-page">

          <div className="member-page-icon">
            <Link to="/">Home</Link>
          </div>

          <div className="member-page-content">
            {params.id === "login" 
            ? <Login />
            : <Signup />}
          </div>
          
        </div>
      : <></>}
    </>
  );
}

export default Member;