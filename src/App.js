import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthPage from './components/AuthPage';
import Member from './pages/member/Member';
import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path='/member/:id' element={<Member />} />
      </Routes>
  );
};

export default App;
