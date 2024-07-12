import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CardDetailPage = () => {
  const navigate = useNavigate();

  return (
      <div>
        <form>
          <label>
            제목:
            <input type="text" name="title" />
          </label>
          <label>
            상태:
            <input type="text" name="status" value="Done" readOnly />
          </label>
          <label>
            담당자:
            <input type="text" name="assignee" value="User_Id" readOnly />
          </label>
          <label>
            마감일자:
            <input type="date" name="deadline" />
          </label>
          <label>
            내용:
            <textarea name="description"></textarea>
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => alert('수정 기능')}>수정</button>
          <button type="button" onClick={() => alert('삭제 기능')}>삭제</button>
        </form>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
  );
};

export default CardDetailPage;
