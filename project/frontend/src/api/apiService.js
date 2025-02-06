import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// ✅ API 요청 함수 (토큰을 각 요청의 개별 `headers`로 설정)
export const apiRequest = async (url, method, data = null) => {
  try {
    let token = sessionStorage.getItem('token');
    console.log('API 요청:', { url, method, data, token });
    const header = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ 토큰이 있으면 추가
    }

    const response = await axios({
      url: `${BASE_URL}${url}`, // ✅ BASE_URL 추가
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ 토큰이 있으면 추가
      }
    });
    console.log('API 요청 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};
