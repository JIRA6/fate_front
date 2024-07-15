import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./mainpage.css";

function MainPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [editBoardId, setEditBoardId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const managerStatus = localStorage.getItem('isManager');// 매니저 여부 확인
    setIsLogin(token); // 토큰이 존재하면 로그인 상태로 설정
    setIsManager(managerStatus); // 매니저 상태 설정
    console.log(isManager)

    if (token) {
      fetchBoards(token);
    }
  }, [isManager]);

  const fetchBoards = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/boards', {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      setBoards(response.data.data);
    } catch (error) {
      console.error('보드 조회 실패:', error);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://localhost:8080/api/users/logout', {}, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isManager'); // 로그아웃 시 매니저 여부 제거
      setIsLogin(false);
      setIsManager(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleAccountDeletion = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete('http://localhost:8080/api/users/withdraw', {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      alert('회원탈퇴가 완료되었습니다.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isManager'); // 탈퇴 시 매니저 여부 제거
      setIsLogin(false);
      setIsManager(false);
      setShowWarning(false);
      navigate('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
    }
  };

  const addBoard = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const newBoard = { name: newBoardName, description: newBoardDescription };
      const response = await axios.post('http://localhost:8080/api/boards', newBoard, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      setBoards([...boards, response.data.data]);
      setNewBoardName('');
      setNewBoardDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('보드 추가 실패:', error);
    }
  };

  const deleteBoard = async (boardId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://localhost:8080/api/boards/${boardId}`, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      setBoards(boards.filter(board => board.id !== boardId));
    } catch (error) {
      console.error('보드 삭제 실패:', error);
    }
  };

  const updateBoard = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const updatedBoard = { name: newBoardName, description: newBoardDescription };
      const response = await axios.put(`http://localhost:8080/api/boards/${editBoardId}`, updatedBoard, {
        headers: {
          Authorization: `${token}`,
        },
        withCredentials: true,
      });
      setBoards(boards.map(board => (board.id === editBoardId ? response.data.data : board)));
      setNewBoardName('');
      setNewBoardDescription('');
      setShowForm(false);
      setEditBoardId(null);
    } catch (error) {
      console.error('보드 수정 실패:', error);
    }
  };

  const handleEditClick = (board) => {
    setEditBoardId(board.id);
    setNewBoardName(board.name);
    setNewBoardDescription(board.description);
    setShowForm(true);
  };

  return (
      <div className="mainpage-component">
        <header className="navbar">
          <div className="left-section">
            <div className="logo">로고</div>
            {isLogin && <button onClick={handleLogout}>로그아웃</button>}
          </div>
          <div className="navbar-buttons">
            {isLogin ? (
                <>
                  <button className="right" onClick={() => setShowWarning(true)}>회원탈퇴</button>
                </>
            ) : (
                <>
                  <button onClick={() => navigate('/member/login')}>로그인</button>
                  <button onClick={() => navigate('/member/signup')}>회원가입</button>
                </>
            )}
          </div>
        </header>
        <main>
          <div className="board-container">
            {boards.map((board) => (
                <div key={board.id} className="board-card">
                  <h2 onClick={() => navigate(`/project/${board.id}`)}>{board.name}</h2>
                  <p onClick={() => navigate(`/project/${board.id}`)}>{board.description}</p>
                  {isManager && (
                      <>
                        <button onClick={() => handleEditClick(board)}>수정</button>
                        <button onClick={() => deleteBoard(board.id)}>삭제</button>
                      </>
                  )}
                </div>
            ))}
          </div>
          {isManager && (
              <>
                <button onClick={() => setShowForm(true)}>보드 추가</button>
                {showForm && (
                    <div className="board-form">
                      <input
                          type="text"
                          placeholder="보드 이름"
                          value={newBoardName}
                          onChange={(e) => setNewBoardName(e.target.value)}
                      />
                      <input
                          type="text"
                          placeholder="한줄 소개"
                          value={newBoardDescription}
                          onChange={(e) => setNewBoardDescription(e.target.value)}
                      />
                      <div className="form-buttons">
                        <button onClick={editBoardId ? updateBoard : addBoard}>{editBoardId ? '수정' : '추가'}</button>
                        <button onClick={() => setShowForm(false)}>취소</button>
                      </div>
                    </div>
                )}
              </>
          )}
          {showWarning && (
              <div className="warning-modal">
                <div className="warning-content">
                  <p>경고</p>
                  <p>회원탈퇴 입니다.</p>
                  <button onClick={handleAccountDeletion}>완료</button>
                  <button onClick={() => setShowWarning(false)}>취소</button>
                </div>
              </div>
          )}
        </main>
      </div>
  );
}

export default MainPage;
