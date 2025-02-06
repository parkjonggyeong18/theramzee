import { verify } from "crypto";

// 공통 api 호출 함수
const apiCient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 header jwt token 추가
apiCient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiCient.interceptors.response.use(
    (response) => {
        // 응답 성공 시 그대로 반환
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 Unauthorized 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지 플래그 설정
            
            try {
                // 토큰 갱신 요청
                const { accessToken } = await refreshToken();

                // 새 Access Token으로 Authorization 헤더 업데이트
                apiCient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // 실패했던 요청 재시도
                return apiCient(originalRequest);

            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
                // 로그아웃 처리 또는 페이지 리다이렉트
                localStorage.removeItem('accessToken');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
            }
        }

        // 기타 오류는 그대로 반환
        return Promise.reject(error);
    }
);


//친구
export const getFriendList = async () => {
    try {
        const response = await apiCient.get('/friends/list');
        return response.data;
    } catch (error) {
        throw error;
    }  
};

export const sendFriendRequest = async (username) => {
    try {
        const response = await apiCient.post(`/friends/request/${ nickName }`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFriendRequestList = async () => {
    try {
        const response = await apiCient.get('/friends/request/');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const acceptFriendRequest = async (username) => {
    try {
        const response = await apiCient.post(`/friends/accept/${ nickName }`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteFriend = async (username) => {
    try {
        const response = await apiCient.delete(`/friends/${ nickName }`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const followFriend = async (username) => {
    try {
        const response = await apiCient.post(`/rooms/follow/${ nickName }`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const setAuthToken = (newToken) => {
    token = `Bearer ${newToken}`;
  };

//회원
export const getProfile = async () => {
    try {
        const response = await apiCient.get('/users/me');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (userInfo) => {
    try {
        const response = await apiCient.put(`/users/update`, userInfo);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async () => {
    try {
        const response = await apiCient.delete(`/users/delete`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

//이메일
export const sendEmail = async (email) => {
    try {
        const response = await apiCient.post(`/email/email-send`, email);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async (email, username) => {
    try {
        const response = await apiCient.post(`/email/reset-password`, {email, username});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const verifyEmail = async (email, code) => {
    try {
        const response = await apiCient.post(`/email/email-auth`, {email, code});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const findUsername = async (name, email) => {
    try {
        const response = await apiCient.post(`/email/find-username`, {name, email});
        return response.data;
    } catch (error) {
        throw error;
    }
}

//인증
export const register = async (userInfo) => {
    try {
        const response = await apiCient.post('/auth/register', userInfo);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const login = async (credentials) => {
    try {
        const response = await apiCient.post('/auth/login', credentials);
        // 로그인 후 JWT 토큰 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await apiCient.post('/auth/logout');
        // 로그아웃 후 토큰 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('nickname', nickname);
        return response.data;
    } catch (error) {
        throw error;
    } 
};

export const refreshToken = async () => {
    try {
        // 만료된 Access Token 가져오기
        const expiredAccessToken = localStorage.getItem('accessToken');
        
        // Refresh Token 요청: 만료된 Access Token만 전달
        const response = await apiCient.post('/auth/refresh-token', null, {
            headers: {
                Authorization: `Bearer ${expiredAccessToken}`,
            },
        });

        // 새로 발급받은 Access Token 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data;
    } catch (error) {
        console.error('토큰 갱신 중 오류 발생:', error);
        throw error;
    }
};

//채팅
export const getChatHistory = async (sender, receiver) => {
    try {
        const response = await apiCient.get('/chat/history', {
            params: { sender, receiver },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAsRead = async (sender, receiver) => {
    try {
        const response = await apiCient.put('/chat/mark-as-read', { sender, receiver });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnreadChatList = async (username) => {
    try {
        const response = await apiCient.get('/chat/unread-count?receiver=' + username);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const accessToken = localStorage.getItem('accessToken');

if (!accessToken) {
  console.error('accessToken이 없습니다.');
} else {
  const decodeAccessToken = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('토큰 디코딩 중 에러 발생:', error);
      return null;
    }
  };

  const decodedData = decodeAccessToken(accessToken);

  if (decodedData) {
    console.log('디코딩된 데이터:', decodedData);
//    const userId = decodedData.sub; // 사용자 ID (sub)
    const nickname = decodedData.nickname; // 닉네임
//    localStorage.setItem('userId', userId);
    localStorage.setItem('nickname', nickname);
//    console.log(`사용자 ID: ${userId}`);
    console.log(`닉네임: ${nickname}`);

  } else {
    console.error('디코딩된 데이터가 유효하지 않습니다.');
  }

  localStorage.setItem('accessToken', accessToken);

  console.log('디코딩 후 수정 없이 accessToken을 다시 저장했습니다.');
}