import axios from 'axios';

// API 기본 URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ramzee.online:8080';

// 토큰 갱신 함수
export const refreshToken = async () => {
    try {
        const expiredAccessToken = sessionStorage.getItem('accessToken'); // 만료된 Access Token
        const response = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, 'POST', {
            headers: {
                Authorization: `Bearer ${expiredAccessToken}`, // 만료된 토큰 전달
            },
        });
        console.log('토큰 갱신 요청 성공:', response.data.data.accessToken);
        // 새 토큰 저장
        sessionStorage.setItem('accessToken', response.data.data.accessToken);
        console.log('새 토큰 발급 성공:', response.data.data.accessToken);
        return response.data.data.accessToken;
    } catch (error) {
        console.error('토큰 갱신 실패:', error);

        // 인증 실패 처리: 로그아웃 및 로그인 페이지로 이동
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
        throw error;
    }
};

// API 요청 함수
export const apiRequest = async (url, method, data = null) => {
  try {
    const token = sessionStorage.getItem('accessToken');
    console.log("Token check:", token); // 토큰 존재 여부 확인

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Bearer 접두어 확인
    };

    console.log("Request headers:", headers); // 헤더 확인

    const response = await axios({
      url: `${BASE_URL}${url}`,
      method,
      data: data ? JSON.stringify(data) : "{}",
      headers
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};