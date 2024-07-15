import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';
import Member from './pages/member/Member';
import NotFound from './components/global/NotFound';
import BoardDetailPage from './components/boarddetail/BoardDetailPage';
import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/member/:id" element={<Member />} />
        <Route path="/project/:id" element={<BoardDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App;
