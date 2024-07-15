import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CardDetailPage = () => {
  const navigate = useNavigate();

  return React.createElement(
      'div',
      null,
      React.createElement(
          'form',
          null,
          React.createElement(
              'label',
              null,
              '제목:',
              React.createElement('input', { type: 'text', name: 'title' })
          ),
          React.createElement(
              'label',
              null,
              '상태:',
              React.createElement('input', { type: 'text', name: 'status', value: 'Done', readOnly: true })
          ),
          React.createElement(
              'label',
              null,
              '담당자:',
              React.createElement('input', { type: 'text', name: 'assignee', value: 'User_Id', readOnly: true })
          ),
          React.createElement(
              'label',
              null,
              '마감일자:',
              React.createElement('input', { type: 'date', name: 'deadline' })
          ),
          React.createElement(
              'label',
              null,
              '내용:',
              React.createElement('textarea', { name: 'description' })
          ),
          React.createElement(
              'button',
              { type: 'submit' },
              'Submit'
          ),
          React.createElement(
              'button',
              { type: 'button', onClick: () => alert('수정 기능') },
              '수정'
          ),
          React.createElement(
              'button',
              { type: 'button', onClick: () => alert('삭제 기능') },
              '삭제'
          )
      ),
      React.createElement(
          'button',
          { onClick: () => navigate(-1) },
          '뒤로 가기'
      )
  );
};

export default CardDetailPage;
