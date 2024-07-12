import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// 프로젝트 객체의 타입 정의
interface Project {
  id: number;
  name: string;
  description: string;
}

const MainPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
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

  return (
      <div>
        <header className="navbar">
          <div className="logo">로고</div>
          <div className="navbar-buttons">
            {isLoggedIn ? (
                <button onClick={handleLogout}>로그아웃</button>
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
            {projects.map(project => (
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
                <button onClick={addProject}>추가</button>
                <button onClick={() => setShowForm(false)}>취소</button>
              </div>
          )}
        </main>
      </div>
  );
};

export default MainPage;
