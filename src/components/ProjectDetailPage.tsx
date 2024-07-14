import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../App.css';

const ItemType = {
  CARD: 'card',
};

// 카드 객체의 타입 정의
interface Card {
  id: number;
  name: string;
  assignee: string;
  deadline: string;
  description: string;
  status: string;
}

// 프로젝트 객체의 타입 정의
interface Project {
  id: number;
  name: string;
  description: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>();
  const [cards, setCards] = useState<Card[]>([]);
  const [newCardName, setNewCardName] = useState('');
  const [newCardAssignee, setNewCardAssignee] = useState('');
  const [newCardDeadline, setNewCardDeadline] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardStatus, setNewCardStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const currentProject = storedProjects.find((proj: Project) => proj.id === parseInt(id!));
    setProject(currentProject);

    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, [id]);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    navigate('/');
  };

  const addCard = (status: string) => {
    const newCard = {
      id: cards.length + 1,
      name: newCardName,
      assignee: newCardAssignee,
      deadline: newCardDeadline,
      description: newCardDescription,
      status,
    };
    setCards([...cards, newCard]);
    setNewCardName('');
    setNewCardAssignee('');
    setNewCardDeadline('');
    setNewCardDescription('');
    setShowForm(false);
  };

  const moveCard = (id: number, status: string) => {
    setCards(cards.map(card => card.id === id ? { ...card, status } : card));
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
    setAssigneeDropdownOpen(false); // Close assignee dropdown if open
  };

  const toggleAssigneeDropdown = () => {
    setAssigneeDropdownOpen(!assigneeDropdownOpen);
    setStatusDropdownOpen(false); // Close status dropdown if open
  };

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="project-detail-container">
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
          <div className="project-header">
            <h1>{project?.name}</h1>
            <p>{project?.description}</p>
            <div className="project-buttons">
              <button onClick={() => alert('컬럼 이동')}>컬럼 이동</button>
              <button onClick={() => alert('초대')}>초대</button>
              <button onClick={() => alert('수정')}>수정</button>
              <button onClick={() => alert('삭제')}>삭제</button>
            </div>
          </div>
          <main>
            <div className="task-board-header">
              {/* Status dropdown */}
              <div className="dropdown status-dropdown">
                <button onClick={toggleStatusDropdown}>상태별 리스트</button>
                {statusDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li onClick={() => alert('Emergency 선택')}>Emergency</li>
                      <li onClick={() => alert('Todo 선택')}>Todo</li>
                      <li onClick={() => alert('In Progress 선택')}>In Progress</li>
                      <li onClick={() => alert('Done 선택')}>Done</li>
                    </ul>
                )}
              </div>
              {/* Assignee dropdown */}
              <div className="dropdown assignee-dropdown">
                <button onClick={toggleAssigneeDropdown}>작업자별 리스트</button>
                {assigneeDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li onClick={() => alert('User A 선택')}>User A</li>
                      <li onClick={() => alert('User B 선택')}>User B</li>
                      <li onClick={() => alert('User C 선택')}>User C</li>
                      <li onClick={() => alert('User D 선택')}>User D</li>
                    </ul>
                )}
              </div>
            </div>
            <div className="task-board">
              {['Emergency', 'Todo', 'In Progress', 'Done'].map(status => (
                  <TaskColumn
                      key={status}
                      status={status}
                      cards={cards.filter(card => card.status === status)}
                      moveCard={moveCard}
                      addCard={() => {
                        setNewCardStatus(status);
                        setShowForm(true);
                      }}
                  />
              ))}
            </div>
            {showForm && (
                <div className="card-form">
                  <input
                      type="text"
                      placeholder="카드 이름"
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value)}
                  />
                  <input
                      type="text"
                      placeholder="담당자"
                      value={newCardAssignee}
                      onChange={(e) => setNewCardAssignee(e.target.value)}
                  />
                  <input
                      type="date"
                      placeholder="마감일자"
                      value={newCardDeadline}
                      onChange={(e) => setNewCardDeadline(e.target.value)}
                  />
                  <textarea
                      placeholder="내용"
                      value={newCardDescription}
                      onChange={(e) => setNewCardDescription(e.target.value)}
                  />
                  <button onClick={() => addCard(newCardStatus)}>카드 추가</button>
                  <button onClick={() => setShowForm(false)}>취소</button>
                </div>
            )}
          </main>
        </div>
      </DndProvider>
  );
};

interface TaskColumnProps {
  status: string;
  cards: Card[];
  moveCard: (id: number, status: string) => void;
  addCard: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, cards, moveCard, addCard }) => {
  const [, drop] = useDrop({
    accept: ItemType.CARD,
    drop: (item: { id: number }) => moveCard(item.id, status),
  });

  return (
      <div ref={drop} className="task-column">
        <div className="column-header">
          <h2>{status}</h2>
          <div className="column-buttons">
            <button onClick={() => alert(`${status} 카드 이동`)}>카드 이동</button>
            <button onClick={() => alert(`${status} 수정`)}>수정</button>
            <button onClick={() => alert(`${status} 삭제`)}>삭제</button>
          </div>
        </div>
        {cards.map(card => (
            <TaskCard key={card.id} card={card} />
        ))}
        <button onClick={addCard}>+ 카드 추가</button>
      </div>
  );
};

interface TaskCardProps {
  card: Card;
}

const TaskCard: React.FC<TaskCardProps> = ({ card }) => {
  const [, drag] = useDrag({
    type: ItemType.CARD,
    item: { id: card.id },
  });

  return (
      <div ref={drag} className="task-card">
        <h3>{card.name}</h3>
        <p>{card.assignee}</p>
        <p>{card.deadline}</p>
        <p>{card.description}</p>
      </div>
  );
};

export default ProjectDetailPage;
