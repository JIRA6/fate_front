import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import AuthPage from './components/AuthPage';
import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
  );
};

export default App;
