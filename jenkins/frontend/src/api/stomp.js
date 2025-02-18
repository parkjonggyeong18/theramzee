import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ramzee.online';

let stompClient = null;

export const connectSocket = async () => {
  return new Promise((resolve, reject) => {
    let token = sessionStorage.getItem('accessToken');
    const socket = new SockJS(`${BASE_URL}/ws`);

    stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log(`STOMP Debug: ${str}`),
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("✅ Connected to WebSocket:", frame);
        resolve(stompClient);
      },
      onStompError: (frame) => {
        console.error("🚨 STOMP error:", frame);
        reject(frame);
      },
      onDisconnect: () => {
        console.log("🔴 WebSocket disconnected");
      },
    });

    stompClient.activate();
  });
};

export const disconnectSocket = async () => {
  if (stompClient !== null) {
    await stompClient.deactivate();
    stompClient = null;
    console.log('STOMP 연결이 해제되었습니다.');
  }
};

export const subscribeToTopic = (topic, callback) => {
  if (stompClient !== null && stompClient.connected) {
    const subscription = stompClient.subscribe(topic, (message) => {
      console.log(`메시지 수신 [${topic}]:`, message);
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error('메시지 파싱 실패:', error);
        callback(message.body);
      }
    });
    console.log(`${topic}에 구독 성공`);
    return subscription;
  } else {
    console.error('STOMP 연결이 되어 있지 않아 구독 실패');
    return null;
  }
};

export const sendMessage = async (destination, body) => {
  if (stompClient !== null && stompClient.connected) {
    await stompClient.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
    console.log(`메시지 전송 [${destination}]:`, body);
  } else {
    const error = new Error('STOMP 연결이 되어있지 않아 메시지 전송 실패');
    console.error(error);
    throw error;
  }
};

export const unsubscribeTopic = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
    console.log('구독이 해제되었습니다.');
  }
};

// 채팅 관련 토픽 상수
export const CHAT_TOPICS = {
  PRIVATE_CHAT: (sender, receiver) => `/topic/chat/${sender}-${receiver}`,
  CHAT_NOTIFICATIONS: (username) => `/topic/chat-notifications/${username}`,
  UNREAD_COUNT: (username) => `/topic/unread-count/${username}`,
};

// Friend 관련 토픽 상수
export const FRIEND_TOPICS = {
  FRIENDS: (username) => `/topic/friends/${username}`,
  FRIEND_REQUESTS: (username) => `/topic/friend-requests/${username}`,
  NICKNAME_UPDATES: (username) => `/topic/nickname-updates/${username}`
};

// 채팅 메시지 전송 헬퍼 함수
export const sendChatMessage = async (sender, receiver, content) => {
  const destination = CHAT_TOPICS.PRIVATE_CHAT(sender, receiver);
  const message = {
    sender,
    receiver,
    content,
    timestamp: new Date().toISOString()
  };
  await sendMessage(destination, message);
};

// 채팅방 구독 헬퍼 함수
export const subscribeToChatRoom = (sender, receiver, callback) => {
  const topic = CHAT_TOPICS.PRIVATE_CHAT(sender, receiver);
  return subscribeToTopic(topic, callback);
};