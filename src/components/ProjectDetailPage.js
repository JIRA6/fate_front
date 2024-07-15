import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../App.css';

const ItemType = {
  CARD: 'card',
};

// 카드 객체의 타입 정의
const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(undefined);
  const [cards, setCards] = useState([]);
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
    const currentProject = storedProjects.find(proj => proj.id === parseInt(id));
    setProject(currentProject);

    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, [id]);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    navigate('/');
  };

  const addCard = (status) => {
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

  const moveCard = (id, status) => {
    setCards(cards.map(card => card.id === id ? { ...card, status } : card));
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
    setAssigneeDropdownOpen(false);
  };

  const toggleAssigneeDropdown = () => {
    setAssigneeDropdownOpen(!assigneeDropdownOpen);
    setStatusDropdownOpen(false);
  };

  return React.createElement(
      DndProvider,
      { backend: HTML5Backend },
      React.createElement(
          'div',
          { className: 'project-detail-container' },
          React.createElement(
              'header',
              { className: 'navbar' },
              React.createElement('div', { className: 'logo' }, '로고'),
              React.createElement(
                  'div',
                  { className: 'navbar-buttons' },
                  isLoggedIn
                      ? React.createElement('button', { onClick: handleLogout }, '로그아웃')
                      : [
                        React.createElement('button', { key: 'login', onClick: () => navigate('/auth') }, '로그인'),
                        React.createElement('button', { key: 'signup', onClick: () => navigate('/auth?mode=signup') }, '회원가입')
                      ]
              )
          ),
          React.createElement(
              'div',
              { className: 'project-header' },
              React.createElement('h1', null, project?.name),
              React.createElement('p', null, project?.description),
              React.createElement(
                  'div',
                  { className: 'project-buttons' },
                  React.createElement('button', { onClick: () => alert('컬럼 이동') }, '컬럼 이동'),
                  React.createElement('button', { onClick: () => alert('초대') }, '초대'),
                  React.createElement('button', { onClick: () => alert('수정') }, '수정'),
                  React.createElement('button', { onClick: () => alert('삭제') }, '삭제')
              )
          ),
          React.createElement(
              'main',
              null,
              React.createElement(
                  'div',
                  { className: 'task-board-header' },
                  React.createElement(
                      'div',
                      { className: 'dropdown status-dropdown' },
                      React.createElement('button', { onClick: toggleStatusDropdown }, '상태별 리스트'),
                      statusDropdownOpen &&
                      React.createElement(
                          'ul',
                          { className: 'dropdown-menu' },
                          React.createElement('li', { onClick: () => alert('Emergency 선택') }, 'Emergency'),
                          React.createElement('li', { onClick: () => alert('Todo 선택') }, 'Todo'),
                          React.createElement('li', { onClick: () => alert('In Progress 선택') }, 'In Progress'),
                          React.createElement('li', { onClick: () => alert('Done 선택') }, 'Done')
                      )
                  ),
                  React.createElement(
                      'div',
                      { className: 'dropdown assignee-dropdown' },
                      React.createElement('button', { onClick: toggleAssigneeDropdown }, '작업자별 리스트'),
                      assigneeDropdownOpen &&
                      React.createElement(
                          'ul',
                          { className: 'dropdown-menu' },
                          React.createElement('li', { onClick: () => alert('User A 선택') }, 'User A'),
                          React.createElement('li', { onClick: () => alert('User B 선택') }, 'User B'),
                          React.createElement('li', { onClick: () => alert('User C 선택') }, 'User C'),
                          React.createElement('li', { onClick: () => alert('User D 선택') }, 'User D')
                      )
                  )
              ),
              React.createElement(
                  'div',
                  { className: 'task-board' },
                  ['Emergency', 'Todo', 'In Progress', 'Done'].map(status =>
                      React.createElement(TaskColumn, {
                        key: status,
                        status,
                        cards: cards.filter(card => card.status === status),
                        moveCard,
                        addCard: () => {
                          setNewCardStatus(status);
                          setShowForm(true);
                        }
                      })
                  )
              ),
              showForm &&
              React.createElement(
                  'div',
                  { className: 'card-form' },
                  React.createElement('input', {
                    type: 'text',
                    placeholder: '카드 이름',
                    value: newCardName,
                    onChange: (e) => setNewCardName(e.target.value)
                  }),
                  React.createElement('input', {
                    type: 'text',
                    placeholder: '담당자',
                    value: newCardAssignee,
                    onChange: (e) => setNewCardAssignee(e.target.value)
                  }),
                  React.createElement('input', {
                    type: 'date',
                    placeholder: '마감일자',
                    value: newCardDeadline,
                    onChange: (e) => setNewCardDeadline(e.target.value)
                  }),
                  React.createElement('textarea', {
                    placeholder: '내용',
                    value: newCardDescription,
                    onChange: (e) => setNewCardDescription(e.target.value)
                  }),
                  React.createElement('button', { onClick: () => addCard(newCardStatus) }, '카드 추가'),
                  React.createElement('button', { onClick: () => setShowForm(false) }, '취소')
              )
          )
      )
  );
};

const TaskColumn = ({ status, cards, moveCard, addCard }) => {
  const [, drop] = useDrop({
    accept: ItemType.CARD,
    drop: (item) => moveCard(item.id, status),
  });

  return React.createElement(
      'div',
      { ref: drop, className: 'task-column' },
      React.createElement(
          'div',
          { className: 'column-header' },
          React.createElement('h2', null, status),
          React.createElement(
              'div',
              { className: 'column-buttons' },
              React.createElement('button', { onClick: () => alert(`${status} 카드 이동`) }, '카드 이동'),
              React.createElement('button', { onClick: () => alert(`${status} 수정`) }, '수정'),
              React.createElement('button', { onClick: () => alert(`${status} 삭제`) }, '삭제')
          )
      ),
      cards.map(card => React.createElement(TaskCard, { key: card.id, card })),
      React.createElement('button', { onClick: addCard }, '+ 카드 추가')
  );
};

const TaskCard = ({ card }) => {
  const [, drag] = useDrag({
    type: ItemType.CARD,
    item: { id: card.id },
  });

  return React.createElement(
      'div',
      { ref: drag, className: 'task-card' },
      React.createElement('h3', null, card.name),
      React.createElement('p', null, card.assignee),
      React.createElement('p', null, card.deadline),
      React.createElement('p', null, card.description)
  );
};

export default ProjectDetailPage;
