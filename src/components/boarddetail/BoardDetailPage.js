import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './boarddetailpage.css';

function BoardDetailPage() {
  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContents, setNewCardContents] = useState('');
  const [newCardStatus, setNewCardStatus] = useState('보류');
  const [newCardOrder, setNewCardOrder] = useState(0);
  const [newCardDeadline, setNewCardDeadline] = useState('');
  const [newCardTeamId, setNewCardTeamId] = useState(1);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const { id: boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const managerStatus = localStorage.getItem('isManager') === 'true';
    setIsManager(managerStatus);

    fetchColumns(token);
  }, [boardId, navigate]);

  const fetchColumns = async (token) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/boards/${boardId}/columns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setColumns(response.data.data);
    } catch (error) {
      console.error('컬럼 조회 실패:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const createColumn = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    if (columns.length >= 4) {
      alert('최대 4개의 컬럼만 추가할 수 있습니다.');
      return;
    }
    try {
      const newColumn = { columnName: newColumnTitle, columnOrder: columns.length };
      await axios.post(`http://localhost:8080/api/boards/${boardId}/columns`, newColumn, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchColumns(token);
      setNewColumnTitle('');
    } catch (error) {
      console.error('컬럼 생성 실패:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const updateColumn = async (columnId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const updatedColumn = { columnName: newColumnTitle };
      await axios.put(`http://localhost:8080/api/boards/${boardId}/columns/${columnId}`, updatedColumn, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchColumns(token);
      setNewColumnTitle('');
    } catch (error) {
      console.error('컬럼 수정 실패:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const createCard = async (columnId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const newCard = {
        cardTitle: newCardTitle,
        cardContents: newCardContents,
        cardStatus: newCardStatus,
        cardOrder: newCardOrder,
        deadlineAt: newCardDeadline,
        teamId: newCardTeamId,
      };
      await axios.post(`http://localhost:8080/api/columns/${columnId}/cards`, newCard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchColumns(token);
      setNewCardTitle('');
      setNewCardContents('');
      setNewCardStatus('보류');
      setNewCardOrder(0);
      setNewCardDeadline('');
      setNewCardTeamId(1);
      setSelectedColumnId(null);
    } catch (error) {
      console.error('카드 생성 실패:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const deleteCard = async (columnId, cardId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/api/columns/${columnId}/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchColumns(token);
    } catch (error) {
      console.error('카드 삭제 실패:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleStatusChange = (e) => {
    setNewCardStatus(e.target.value);
  };

  return (
      <div className="project-detail-container">
        <header className="navbar">
          <div className="left-section">
            <div className="logo" onClick={() => navigate('/')}>로고</div>
            {isManager && <button onClick={() => navigate('/login')}>로그인</button>}
          </div>
          <div className="navbar-buttons">
            {isManager ? (
                <>
                  <button onClick={() => navigate('/signup')}>회원가입</button>
                  <button onClick={() => navigate('/logout')}>로그아웃</button>
                </>
            ) : (
                <>
                  <button onClick={() => navigate('/member/login')}>로그인</button>
                  <button onClick={() => navigate('/member/signup')}>회원가입</button>
                </>
            )}
          </div>
        </header>
        <header className="project-header">
          <h1>Project Name</h1>
          <p>한 줄 소개</p>
          <div className="project-buttons">
            <input
                type="text"
                placeholder="컬럼 이름"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
            />
            <button onClick={createColumn}>컬럼 추가</button>
          </div>
        </header>
        <div className="task-board">
          {columns.map((column) => (
              <div key={column.id} className="task-column">
                <div className="column-header">
                  <h2>{column.columnName}</h2>
                  {isManager && (
                      <div className="column-actions">
                        <button onClick={() => updateColumn(column.id)}>수정</button>
                      </div>
                  )}
                </div>
                {column.cards && column.cards.map((card) => (
                    <div key={card.id} className="task-card">
                      <p>{card.cardTitle}</p>
                      {isManager && (
                          <button onClick={() => deleteCard(column.id, card.id)}>카드 삭제</button>
                      )}
                    </div>
                ))}
                {isManager && (
                    <div className="card-form">
                      <label>
                        카드 이름:
                        <input
                            type="text"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                        />
                      </label>
                      <label>
                        카드 내용:
                        <input
                            type="text"
                            value={newCardContents}
                            onChange={(e) => setNewCardContents(e.target.value)}
                        />
                      </label>
                      <label>
                        카드 상태:
                        <select value={newCardStatus} onChange={handleStatusChange}>
                          <option value="보류">보류</option>
                          <option value="진행중">진행중</option>
                          <option value="완료">완료</option>
                        </select>
                      </label>
                      <label>
                        카드 순서:
                        <input
                            type="number"
                            value={newCardOrder}
                            onChange={(e) => setNewCardOrder(e.target.value)}
                        />
                      </label>
                      <label>
                        마감일:
                        <input
                            type="date"
                            value={newCardDeadline}
                            onChange={(e) => setNewCardDeadline(e.target.value)}
                        />
                      </label>
                      <label>
                        팀 ID:
                        <input
                            type="number"
                            value={newCardTeamId}
                            onChange={(e) => setNewCardTeamId(e.target.value)}
                        />
                      </label>
                      <button onClick={() => createCard(column.id)}>카드 추가</button>
                    </div>
                )}
              </div>
          ))}
        </div>
      </div>
  );
}

export default BoardDetailPage;
