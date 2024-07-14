import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthPage from './components/AuthPage';
import Member from './pages/member/Member';
import NotFound from './components/global/NotFound';
import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path='/member/:id' element={<Member />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
  );
};

export default App;
