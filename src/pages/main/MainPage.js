import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

const MainPage = () => {
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardIntro, setNewBoardIntro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      fetchBoards();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/users/logout', {}, { withCredentials: true });
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleAccountDeletion = async () => {
    try {
      await axios.post('http://localhost:8080/api/users/withdraw', {}, { withCredentials: true });
      alert('회원탈퇴가 완료되었습니다.');
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      setShowWarning(false);
      navigate('/');
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
    }
  };

  const addProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      description: newProjectDescription,
    };
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectDescription('');
    setShowForm(false);
  };

  const addBoard = async () => {
    try {
      const newBoard = { title: newBoardTitle, intro: newBoardIntro };
      const response = await axios.post('http://localhost:8080/api/boards', newBoard, {
        withCredentials: true,
      });
      setBoards([...boards, response.data.data]);
      setNewBoardTitle('');
      setNewBoardIntro('');
    } catch (error) {
      console.error('보드 생성 실패:', error);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/boards', {
        withCredentials: true,
      });
      setBoards(response.data.data);
    } catch (error) {
      console.error('보드 조회 실패:', error);
    }
  };

  return (
      <div>
        <header className="navbar">
          <div className="left-section">
            <div className="logo">로고</div>
            {isLoggedIn && <button onClick={handleLogout}>로그아웃</button>}
          </div>
          <div className="navbar-buttons">
            {isLoggedIn ? (
                <>
                  <button className="right" onClick={() => setShowWarning(true)}>
                    회원탈퇴
                  </button>
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
          <div className="project-container">
            {projects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => navigate(`/project/${project.id}`)}>
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}>프로젝트 추가</button>
          {showForm && (
              <div className="project-form">
                <input
                    type="text"
                    placeholder="프로젝트 이름"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="한줄 소개"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                />
                <div className="form-buttons">
                  <button onClick={addProject}>추가</button>
                  <button onClick={() => setShowForm(false)}>취소</button>
                </div>
              </div>
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
          {isLoggedIn && (
              <div className="board-container">
                <h2>보드 목록</h2>
                <ul>
                  {boards.map((board) => (
                      <li key={board.id} onClick={() => navigate(`/project/${board.id}`)}>
                        {board.title}
                      </li>
                  ))}
                </ul>
                <div className="board-form">
                  <input
                      type="text"
                      placeholder="보드 이름"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                  />
                  <input
                      type="text"
                      placeholder="보드 소개"
                      value={newBoardIntro}
                      onChange={(e) => setNewBoardIntro(e.target.value)}
                  />
                  <button onClick={addBoard}>보드 생성</button>
                </div>
              </div>
          )}
        </main>
      </div>
  );
};

export default MainPage;
