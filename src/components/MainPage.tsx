import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { createBoard, getAllBoards, login, signup, logout, withdraw } from '../api';

// 프로젝트 객체의 타입 정의
interface Project {
  id: number;
  name: string;
  description: string;
}

interface Board {
  id: number;
  title: string;
  intro: string;
}

const MainPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardIntro, setNewBoardIntro] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
    if (loggedIn) {
      fetchBoards();
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
    navigate('/');  // 로그아웃 후 메인 페이지로 이동
  };

  const handleAccountDeletion = async () => {
    await withdraw();
    alert('회원탈퇴가 완료되었습니다.');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
    setShowWarning(false); // 모달창 닫기
    navigate('/');  // 회원탈퇴 후 메인 페이지로 이동
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
      const data = await createBoard(newBoard);
      setBoards([...boards, data]);
      setNewBoardTitle('');
      setNewBoardIntro('');
    } catch (error) {
      console.error('보드 생성 실패:', error);
    }
  };

  const fetchBoards = async () => {
    try {
      const data = await getAllBoards();
      setBoards(data);
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
                  <button className="right" onClick={() => setShowWarning(true)}>회원탈퇴</button>
                </>
            ) : (
                <>
                  <button onClick={() => navigate('/auth')}>로그인</button>
                  <button onClick={() => navigate('/auth?mode=signup')}>회원가입</button>
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
                      <li key={board.id}>{board.title}</li>
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
