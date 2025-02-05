import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectSocket = (onConnected) => {
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsIm5pY2tuYW1lIjoiVGVzdFVzZXIxIiwiZXhwIjoxNzM4NjkzNjEzLCJpYXQiOjE3Mzg2OTAwMTN9.YYbY-a4j4etGb7bxqzV6Ys8owEOPviN0xS5yUbyNihugTkdyP0ds1nXugPAVIzwKgHIPUeRbQkE8Ba8_IeWcHQ";

  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket, // SockJS 사용
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: (frame) => {
      console.log("✅ Connected to WebSocket:", frame);
      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      console.error("🚨 STOMP error:", frame);
    },
    onDisconnect: () => {
      console.log("🔴 WebSocket disconnected");
    },
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
};

export const subscribeToTopic = (topic, callback) => {
  if (stompClient !== null) {
    stompClient.subscribe(topic, (message) => {
      callback(JSON.parse(message.body));
    });
  }
};

export const sendMessage = (destination, body) => {
  if (stompClient !== null) {
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
  }
};

export const unsubscribeTopic = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};
