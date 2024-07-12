import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import CardDetailPage from './components/CardDetailPage';
import AuthPage from './components/AuthPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/card/:id" element={<CardDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
  );
}

export default App;
