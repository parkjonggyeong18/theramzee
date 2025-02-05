import React, { useEffect, useState, useRef } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { fetchRoomById } from '../../../api/room';
import { gameStart } from '../../../api/game';
import { useAuth } from '../../../contexts/AuthContext';

const RoomDetail = ({ room, onLeaveRoom }) => {
  const { accessToken } = useAuth();
  const sessionRef = useRef(null);
  const publisherRef = useRef(null);
  const [subscribers, setSubscribers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const joinSession = async () => {
      if (!room?.token) {
        console.error('No room token provided.');
        return;
      }

      try {
        const OV = new OpenVidu();
        const session = OV.initSession();

        session.on('streamCreated', (event) => {
          const subscriber = session.subscribe(event.stream, undefined);
          setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        });

        session.on('streamDestroyed', (event) => {
          setSubscribers((prevSubscribers) =>
            prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
          );
        });

        await session.connect(room.token, { clientData: 'User' });

        const publisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        session.publish(publisher);

        sessionRef.current = session;
        publisherRef.current = publisher;

        // 현재 사용자가 호스트인지 체크
        setIsHost(room.hostNickName === 'User'); // 여기서 실제 닉네임을 비교하도록 변경 필요
      } catch (error) {
        console.error('OpenVidu 세션 참가 실패:', error);
      }
    };

    joinSession();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, [room?.token, room?.hostNickName]);

  const handleStartGame = async () => {
    try {
      const response = await fetchRoomById(room.roomId);
      const nicknames = response?.data?.nicknames || []; // 응답 구조 확인 필요
      await gameStart(room.roomId, nicknames);

      // WebSocket 연결이 필요할 경우 여기에 추가
      console.log('게임 시작 요청 성공');
    } catch (error) {
      console.error('게임 시작 실패:', error);
    }
  };

  return (
    <div>
      <h2>Room Detail</h2>
      <p>Title: {room.title}</p>
      <p>Host: {room.hostNickName}</p>
      <p>Participants: {room.currentParticipantCount}</p>
      <button onClick={onLeaveRoom}>Leave Room</button>
      {isHost && <button onClick={handleStartGame}>Start Game</button>}

      <div id="video-container">
        <div id="publisher" ref={(node) => node && publisherRef.current?.addVideoElement(node)}></div>
        {subscribers.map((sub, index) => (
          <div key={index} ref={(node) => node && sub.addVideoElement(node)}></div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetail;
