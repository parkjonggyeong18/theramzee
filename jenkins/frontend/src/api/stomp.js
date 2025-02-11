import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
//npm install --save-dev @babel/plugin-proposal-private-property-in-object 이것도 깔아라!

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

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
  }
};

export const subscribeToTopic = (topic, callback) => {
  if (stompClient !== null && stompClient.connected) {
    return stompClient.subscribe(topic, (message) => {
      callback(JSON.parse(message.body));
    });
  } else {
    console.error('STOMP client not connected');
    return null;
  }
};

export const sendMessage = async (destination, body) => {
  if (stompClient !== null && stompClient.connected) {
    await stompClient.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
  } else {
    throw new Error('STOMP client not connected');
  }
};

export const unsubscribeTopic = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};
