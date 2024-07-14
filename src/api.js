import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 백엔드 서버 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT 토큰을 설정하는 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 로그인 API 호출 함수
const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

// 회원가입 API 호출 함수
const signup = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response.data;
};

// 로그아웃 API 호출 함수
const logout = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};

// 회원 탈퇴 API 호출 함수
const withdraw = async () => {
  const response = await api.delete('/users/withdrawal');
  return response.data;
};

// 보드 생성 API 호출 함수
const createBoard = async (boardData) => {
  const response = await api.post('/boards', boardData);
  return response.data;
};

// 모든 보드 조회 API 호출 함수
const getAllBoards = async () => {
  const response = await api.get('/boards');
  return response.data;
};

export { login, signup, logout, withdraw, createBoard, getAllBoards };
