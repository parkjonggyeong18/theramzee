import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 토큰 형식 확인
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // 로그인 페이지로 리다이렉트 또는 토큰 갱신 로직
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const roomService = {
  // 방 목록 조회
  getRoomList: async (page = 0, size = 10, searchQuery = '') => {
    try {
      // 토큰 확인 로그
      const token = localStorage.getItem('accessToken');
      console.log('Current token:', token);

      const response = await api.get('/rooms', {
        params: {
          page,
          size,
          search: searchQuery
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // 방 생성
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // 방 입장
  joinRoom: async (roomId, password = '') => {
    try {
      const response = await api.post(`/rooms/${roomId}/join`, { password });
      return response.data.data;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },

  // 방 나가기
  leaveRoom: async (roomId) => {
    try {
      const response = await api.post(`/rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  },

  // 방 정보 조회
  getRoom: async (roomId) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  }
};