import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/main/MainPage';
import Member from './pages/member/Member';
import NotFound from './components/global/NotFound';
import ProjectDetailPage from './components/ProjectDetailPage';
import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/member/:id" element={<Member />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App;
