import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationBar from '../navigation/NavigationBar'; // 네비게이션 바를 import
import './boarddetailpage.css';

function BoardDetailPage() {
  const [columns, setColumns] = useState([]);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContents, setNewCardContents] = useState('');
  const [newCardOrder, setNewCardOrder] = useState(1); // 기본값 설정
  const [newCardDeadline, setNewCardDeadline] = useState('');
  const [newCardTeamId, setNewCardTeamId] = useState(1); // 기본값 설정
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const { id } = useParams(); // boardId 대신 id로 받아옴
  const navigate = useNavigate();

  useEffect(() => {
    console.log('boardId:', id); // id가 제대로 설정되었는지 확인
    const token = localStorage.getItem('accessToken');
    const managerStatus = localStorage.getItem('isManager') === 'true';
    setIsManager(managerStatus);

    if (token && id) {
      fetchColumns(token, id);
    }
  }, [id]);

  const fetchColumns = async (token, boardId) => {
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
  };

  const createColumn = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const newColumn = { columnName: newColumnTitle, columnOrder: columns.length }; // 컬럼 이름과 순서 설정
      await axios.post(`http://localhost:8080/api/boards/${id}/columns`, newColumn, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchColumns(token, id);
      setNewColumnTitle('');
    } catch (error) {
      console.error('컬럼 생성 실패:', error);
    }
  };

  const deleteColumn = async (columnId) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.delete(`http://localhost:8080/api/boards/${id}/columns/${columnId}`, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchColumns(token, id);
    } catch (error) {
      console.error('컬럼 삭제 실패:', error);
    }
  };

  const createCard = async (columnId) => {
    const token = localStorage.getItem('accessToken');
    try {
      const newCard = {
        cardTitle: newCardTitle,
        cardContents: newCardContents,
        cardOrder: newCardOrder,
        deadlineAt: newCardDeadline,
        teamId: newCardTeamId
      }; // 카드 이름과 순서 설정
      await axios.post(`http://localhost:8080/api/columns/${columnId}/cards`, newCard, {
        headers: {
          Authorization: token,
        },
        withCredentials: true,
      });
      fetchColumns(token, id); // 새로운 카드를 추가한 후 컬럼을 다시 불러옴
      setNewCardTitle('');
      setNewCardContents('');
      setNewCardOrder(1);
      setNewCardDeadline('');
      setNewCardTeamId(1);
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
      fetchColumns(token, id);
    } catch (error) {
      console.error('카드 삭제 실패:', error);
    }
  };

  return (
      <div>
        <NavigationBar /> {/* 네비게이션 바 추가 */}
        <div className="project-detail-container">
          <header className="project-header">
            <h1>Project Name</h1>
            <p>한 줄 소개</p>
            <div className="project-buttons">
              <button onClick={() => navigate(`/invite/${id}`)}>초대</button>
              {isManager && (
                  <>
                    <input
                        type="text"
                        placeholder="컬럼 이름"
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                    />
                    <button onClick={createColumn}>컬럼 추가</button>
                  </>
              )}
            </div>
          </header>
          <div className="task-board">
            {columns.map((column) => (
                <div key={column.id} className="task-column">
                  <h2>{column.columnName}</h2>
                  {column.cards && column.cards.map((card) => (
                      <div key={card.id} className="task-card">
                        <p>{card.cardTitle}</p>
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
                        <input
                            type="text"
                            placeholder="카드 내용"
                            value={selectedColumnId === column.id ? newCardContents : ''}
                            onChange={(e) => {
                              setNewCardContents(e.target.value);
                              setSelectedColumnId(column.id);
                            }}
                        />
                        <input
                            type="number"
                            placeholder="카드 순서"
                            value={selectedColumnId === column.id ? newCardOrder : 1}
                            onChange={(e) => {
                              setNewCardOrder(e.target.value);
                              setSelectedColumnId(column.id);
                            }}
                        />
                        <input
                            type="date"
                            placeholder="마감일"
                            value={selectedColumnId === column.id ? newCardDeadline : ''}
                            onChange={(e) => {
                              setNewCardDeadline(e.target.value);
                              setSelectedColumnId(column.id);
                            }}
                        />
                        <input
                            type="number"
                            placeholder="팀 ID"
                            value={selectedColumnId === column.id ? newCardTeamId : 1}
                            onChange={(e) => {
                              setNewCardTeamId(e.target.value);
                              setSelectedColumnId(column.id);
                            }}
                        />
                        <button onClick={() => createCard(column.id)}>카드 추가</button>
                      </div>
                  )}
                  {isManager && (
                      <button onClick={() => deleteColumn(column.id)}>컬럼 삭제</button>
                  )}
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default BoardDetailPage;
