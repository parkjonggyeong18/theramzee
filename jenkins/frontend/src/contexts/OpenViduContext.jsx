import React, { createContext, useContext, useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';

// OpenViduContext 생성
const OpenViduContext = createContext();

export const OpenViduProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]); // 빈 배열로 초기화
  const [isPreview, setIsPreview] = useState(true);
  const [previewPublisher, setPreviewPublisher] = useState(null);
  
  const OV = new OpenVidu();

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession);
    initPreview();

    return () => {
      window.removeEventListener('beforeunload', leaveSession);
    };
  }, []);

  /**
   * 미리보기(Preview) 초기화
   */
  const initPreview = async () => {
    try {
      const processedStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const previewPub = await OV.initPublisherAsync(undefined, {
        videoSource: processedStream.getVideoTracks()[0],
        audioSource: processedStream.getAudioTracks()[0],
        publishAudio: true,
        publishVideo: true,
        mirror: true,
      });

      setPreviewPublisher(previewPub);

    } catch (error) {
      console.error('Preview init error:', error);
    }
  };

  /**
   * 게임 세션 접속
   */
  const joinSession = async (token, userName) => {
    if (session) {
      console.warn("⚠️ Already connected to a session. Leaving current session first...");
      await leaveSession(); // 기존 세션 정리 후 다시 연결
    }
  
    const newSession = OV.initSession();

    // 이벤트 핸들러 등록 전에 구독자 배열 초기화
    setSubscribers([]);

    // 구독자 추가 이벤트
    newSession.on('streamCreated', (event) => {
      setSubscribers((prevSubscribers) => {
        const alreadyExists = prevSubscribers.some(
          (subscriber) =>
            subscriber.stream.connection.connectionId === event.stream.connection.connectionId
        );
        if (!alreadyExists) {
          const subscriber = newSession.subscribe(event.stream, undefined);
          console.log('New stream created:', subscriber);
          return [...prevSubscribers, subscriber];
        }
        return prevSubscribers;
      });
    });

    // 구독자 제거 이벤트
    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter(
          (sub) =>
            sub.stream.connection.connectionId !== event.stream.connection.connectionId
        )
      );
    });

    newSession.on('exception', (exception) => {
      console.warn(exception);
    });
  
    try {
      await newSession.connect(token, { clientData: userName });
  
      const newPublisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: true,
      });
  
      newSession.publish(newPublisher);
      setPublisher(newPublisher);
      setMainStreamManager(newPublisher);
      setSession(newSession);
    } catch (error) {
      console.log('Error connecting to session:', error.code, error.message);
    }
  };

  /**
   * 세션 떠나기
   */
  const leaveSession = async () => {
    try {
      if (session) {
        await session.disconnect();
        console.log(" Session disconnected successfully.");
      } else {
        console.warn(" session.disconnect is not a function. Skipping...");
      }
    } catch (error) {
      console.error("❌ Error disconnecting session:", error);
    }
  
    // 상태 초기화
    setSession(undefined);
    setSubscribers([]);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setIsPreview(true);
    setPreviewPublisher(null);
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    console.log("✅ Session state cleared.");
  };

  return (
    <OpenViduContext.Provider
      value={{
        session,
        mainStreamManager,
        publisher,
        subscribers,
        isPreview,
        previewPublisher,
        joinSession,
        leaveSession,
        setIsPreview,
        initPreview
      }}
    >
      {children}
    </OpenViduContext.Provider>
  );
};

export const useOpenVidu = () => {
  return useContext(OpenViduContext);
};
