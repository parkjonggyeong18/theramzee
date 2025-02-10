// import axios from 'axios';

// // Axios 인스턴스 생성
// const axiosClient = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 요청 인터셉터 추가
// axiosClient.interceptors.request.use(
//   (config) => {
//     // 토큰이 있는 경우 헤더에 추가
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터 추가
// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // 에러 처리
//     if (error.response && error.response.status === 401) {
//       // 인증 오류 처리 (예: 로그아웃)
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;