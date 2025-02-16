import React, { createContext, useContext, useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';

// OpenViduContext 생성
const OpenViduContext = createContext();

// OpenViduProvider 컴포넌트
export const OpenViduProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
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

      const previewPublisher = await OV.initPublisherAsync(undefined, {
        videoSource: processedStream.getVideoTracks()[0],
        audioSource: processedStream.getAudioTracks()[0],
        publishAudio: true,
        publishVideo: true,
        mirror: true,
      });

      setPreviewPublisher(previewPublisher);
    } catch (error) {
      console.error('Preview init error:', error);
    }

    if (previewPublisher) {
      previewPublisher.stream.disposeWebRtcPeer();
      previewPublisher.stream.disposeMediaStream();
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
  
    //  중복된 subscriber 추가 방지
    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      console.log('New stream created:', subscriber);
      setSubscribers((prev) => [...prev, subscriber]);
    });
  
    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prev) => prev.filter(sub => sub.stream.connection.connectionId !== event.stream.connection.connectionId));
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
  
    // ✅ 상태 변경을 보장하기 위해 상태를 먼저 클리어
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

// Context를 사용하는 훅
export const useOpenVidu = () => {
  return useContext(OpenViduContext);
};
