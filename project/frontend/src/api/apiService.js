import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// ✅ API 요청 함수 (토큰을 각 요청의 개별 `headers`로 설정)
export const apiRequest = async (url, method, data = null) => {
  try {
    const token = sessionStorage.getItem('accessToken');

    console.log("📤 API 요청:", { url, method, data, token });

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // 토큰이 있으면 추가
    };

    // 🚨 데이터가 `undefined`이면 빈 객체 `{}`로 설정
    const payload = data ? JSON.stringify(data) : "{}";

    const response = await axios({
      url: `http://localhost:8080${url}`,
      method,
      data: payload, // JSON 변환 후 전송
      headers
    });

    console.log("📥 서버 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API 요청 실패:", error.response?.data || error.message);
    throw error;
  }
};
