import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './boarddetailpage.css';

function BoardDetailPage() {
  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const { boardId } = useParams();
  const navigate = useNavigate();

  const fetchColumns = useCallback(async (token) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/boards/${boardId}/columns`, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      setColumns(response.data.data);
    } catch (error) {
      console.error('컬럼 조회 실패:', error);
    }
  }, [boardId]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const managerStatus = localStorage.getItem('isManager') === 'true';
    setIsManager(managerStatus);

    if (token && boardId) {
      console.log('Fetching columns for boardId:', boardId); // 추가: boardId 값 확인
      fetchColumns(token);
    } else {
      console.error('Token or boardId is missing');
    }
  }, [fetchColumns, boardId]);

  const createColumn = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const newColumn = { columnName: newColumnTitle, columnOrder: columns.length + 1 };
      await axios.post(`http://localhost:8080/api/boards/${boardId}/columns`, newColumn, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchColumns(token);
      setNewColumnTitle('');
    } catch (error) {
      console.error('컬럼 생성 실패:', error);
    }
  };

  const createCard = async (columnId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const newCard = { title: newCardTitle };
      await axios.post(`http://localhost:8080/api/columns/${columnId}/cards`, newCard, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchColumns(token);
      setNewCardTitle('');
      setSelectedColumnId(null);
    } catch (error) {
      console.error('카드 생성 실패:', error);
    }
  };

  const deleteCard = async (columnId, cardId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://localhost:8080/api/columns/${columnId}/cards/${cardId}`, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchColumns(token);
    } catch (error) {
      console.error('카드 삭제 실패:', error);
    }
  };

  return (
      <div className="project-detail-container">
        <header className="project-header">
          <h1>Project Name</h1>
          <p>한 줄 소개</p>
          <div className="project-buttons">
            <button onClick={() => navigate(`/invite/${boardId}`)}>초대</button>
            {isManager && (
                <>
                  <button onClick={createColumn}>컬럼 추가</button>
                </>
            )}
          </div>
        </header>
        <div className="task-board">
          {columns.map((column) => (
              <div key={column.id} className="task-column">
                <h2>{column.columnName}</h2>
                {column.cards.map((card) => (
                    <div key={card.id} className="task-card">
                      <p>{card.title}</p>
                      {isManager && (
                          <>
                            <button onClick={() => deleteCard(column.id, card.id)}>카드 삭제</button>
                          </>
                      )}
                    </div>
                ))}
                {isManager && (
                    <div>
                      <input
                          type="text"
                          placeholder="카드 이름"
                          value={selectedColumnId === column.id ? newCardTitle : ''}
                          onChange={(e) => {
                            setNewCardTitle(e.target.value);
                            setSelectedColumnId(column.id);
                          }}
                      />
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
