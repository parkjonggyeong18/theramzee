import axios from 'axios';

// API 기본 URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ramzee.online';

// 토큰 갱신 함수
export const refreshToken = async () => {
    try {
        const expiredAccessToken = sessionStorage.getItem('accessToken'); // 만료된 Access Token
        const response = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, null, {
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
export const apiRequest = async (url, method, data = null, requiresAuth = true) => {

    try {
        // 로그인 등 토큰이 필요하지 않은 요청 처리
        let accessToken = null;
        if (requiresAuth) {
          accessToken = sessionStorage.getItem('accessToken');
        }

        console.log('API 요청 시작:', { url, method, data });

        // 요청 수행
        const response = await axios({
            url: `${BASE_URL}${url}`,
            method,
            data,
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }), // 토큰이 있으면 헤더에 추가
            },
        });
        

        console.log('API 요청 성공:', response.data);
        return response.data;
    } catch (error) {
        console.error('API 요청 실패:', error.response.data);
        

        // 401 Unauthorized 처리
        if (requiresAuth && error.response?.data === "Unauthorized: Authentication failed") {
            console.warn('401 Unauthorized: 토큰 갱신 시도');

            try {
                // 토큰 갱신
                const accessToken  = await refreshToken();
                console.log("새 토큰 발급 성공2:", accessToken);
                // 요청 재시도
                const retryResponse = await axios({
                    url: `${BASE_URL}${url}`,
                    method,
                    data,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`, // 새 토큰 전달
                    },
                });

                return retryResponse.data;
            } catch (refreshError) {
                console.error('토큰 갱신 후 요청 실패:', refreshError);
                throw refreshError;
            }
        }
        
        throw error;
    }
    
};