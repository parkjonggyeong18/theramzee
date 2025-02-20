import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const GameWebSocket = () => {
  useEffect(() => {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MSIsIm5pY2tuYW1lIjoiVGVzdFVzZXIxIiwiZXhwIjoxNzM4NTk5NTk4LCJpYXQiOjE3Mzg1OTU5OTh9.dFJt3fQfyLWPYfYLRDvERZQlhR9qmmVhGAdXUGc9OSdlM9xx_9JIwxrt1x6IY02q7W6QqAredzFHRRjnCjoA5w";

    const socket = new SockJS('/ws', null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });


    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket 연결 성공');

        client.publish({
          destination: '/app/game/info', 
          body: JSON.stringify({ roomId: 'your-room-id' })
        });

        client.publish({
          destination: '/app/game/start', 
          body: JSON.stringify({
            roomId: 'your-room-id',
            nicknames: ['user1', 'user2']
          })
        });

        client.subscribe('/user/queue/game/info', (message) => {
          const response = JSON.parse(message.body);
          console.log('게임 정보:', response);
        });

        client.subscribe('/topic/game/your-room-id/start', (message) => {
          const response = JSON.parse(message.body);
          console.log('게임 시작:', response);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  return (
    <div>WebSocket 연결 테스트</div>
  );
};

export default GameWebSocket;