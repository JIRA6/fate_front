import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import "./global.css";

function NotFound() {
  return (
    <div>
      <div className="notfound-icon">
        <FontAwesomeIcon className="icon-size-150" icon={faCircle} />
        <FontAwesomeIcon className="icon-size-100 notfound-icon-center" icon={faExclamation} />
      </div>
      <h2 className="notfound-title">찾으시는 페이지가 없습니다</h2>
      <p className="notfound-content">잘못된 접근이거나 요청하신 페이지를 찾을 수 없습니다<br />다시 한번 확인해주세요</p>
      <Link to ="/">
        <button className="notfound-btn">홈으로</button>
      </Link>
    </div>
  );
}

export default NotFound;