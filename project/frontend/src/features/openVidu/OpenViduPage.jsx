import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { OpenVidu } from 'openvidu-browser';

// Filter.js에서 createFaceLandmarkerStream  함수를 가져옴
// import { createFaceLandmarkerStream  } from './components/Filter';

import UserVideoComponent from './components/UserVideoComponent';

class OpenViduPage extends Component {
  constructor(props) {
    super(props);

    // ----- 세션 ID / 닉네임 세팅 -----
    const { roomId } = this.props; // React Router의 useParams로 받아온 값
    const sessionId = `${roomId}-1`; // "roomId-1" 형식으로 세션 ID 설정
    const nickname = sessionStorage.getItem('nickName') || 'Guest';

    this.state = {
      mySessionId: sessionId,
      myUserName: nickname,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],

      // 미리보기 상태
      isPreview: true,
      previewPublisher: null,
    };

    this.OV = null;
  }

  componentDidMount() {
    // 페이지 이탈 시 세션 해제
    window.addEventListener('beforeunload', this.leaveSession);

    // 1) OpenVidu 객체 생성
    this.OV = new OpenVidu();

    // 2) 미리보기용 스트림 준비
    this.initPreview();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.leaveSession);
  }

  /**
   * 미리보기(Preview) 단계에서
   * - Mediapipe 스트림 생성
   * - 이 스트림으로 Publisher 초기화
   * - state.previewPublisher에 저장 -> 화면에 표출
   */
  initPreview = async () => {
    try {
      // (A) Mediapipe로 AI 처리된 스트림 생성
      // const processedStream = await createFaceLandmarkerStream ();
      
      //필터 적용 해제제
      const processedStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // (B) 그 스트림으로 프리뷰용 Publisher 만들기
      const previewPublisher = await this.OV.initPublisherAsync(undefined, {
        videoSource: processedStream.getVideoTracks()[0],
        audioSource: processedStream.getAudioTracks()[0],
        publishAudio: true,
        publishVideo: true,
        mirror: true, // 웹캠처럼 좌우반전
      });

      // (C) state에 저장 -> 프리뷰 모드에서 <UserVideoComponent>로 표시
      this.setState({ previewPublisher });
    } catch (error) {
      console.error('Preview init error:', error);
    }
  };

  /**
   * "게임에 입장하기" 버튼 클릭
   * - 미리보기 유지 (dispose 안 함)
   * - 세션에 접속하고, previewPublisher를 publish
   */
  enterGame = async () => {
    await this.joinSession();
    this.setState({ isPreview: false });
  };

  /**
   * 실제 세션 접속 로직
   */
  joinSession = async () => {
    const session = this.OV.initSession();

    // 새 스트림 생성 이벤트
    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      this.setState({
        subscribers: [...this.state.subscribers, subscriber],
      });
    });

    // 상대방 스트림 끊김
    session.on('streamDestroyed', (event) => {
      this.deleteSubscriber(event.stream.streamManager);
    });

    session.on('exception', (exception) => {
      console.warn(exception);
    });

    // 백엔드에서 가져온 토큰이라고 가정
    const token = sessionStorage.getItem('openViduToken');

    try {
      // 1) 세션 연결
      await session.connect(token, { clientData: this.state.myUserName });

      // 2) 이미 만들어둔 previewPublisher를 publish
      const { previewPublisher } = this.state;
      session.publish(previewPublisher);

      // 3) 본인 스트림 = previewPublisher
      this.setState({
        session,
        publisher: previewPublisher,
        mainStreamManager: previewPublisher,
      });
    } catch (error) {
      console.error('Error connecting to the session:', error);
    }
  };

  /**
   * 세션 떠나기
   */
  leaveSession = () => {
    if (this.state.session) {
      this.state.session.disconnect();
    }

    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mainStreamManager: undefined,
      publisher: undefined,
      previewPublisher: null,
      isPreview: true,
    });
  };

  /**
   * Subscriber 제거
   */
  deleteSubscriber = (streamManager) => {
    this.setState({
      subscribers: this.state.subscribers.filter(
        (sub) => sub !== streamManager
      ),
    });
  };

  // ----------------------
  // 렌더링
  // ----------------------
  render() {
    const {
      isPreview,
      previewPublisher,
      mySessionId,
      mainStreamManager,
      subscribers,
    } = this.state;

    // 1) 미리보기 화면
    if (isPreview) {
      return (
        <div className="preview-container">
          <h1>다람쥐 월드 미리보기</h1>
          <p>AI/AR 필터가 적용된 카메라 영상을 미리 확인하세요.</p>
          <div className="preview-video">
            {previewPublisher && (
              <UserVideoComponent streamManager={previewPublisher} />
            )}
          </div>
          <button onClick={this.enterGame}>게임에 입장하기</button>
        </div>
      );
    }

    // 2) 세션 화면
    const allStreams = [];
    if (mainStreamManager) allStreams.push(mainStreamManager);
    allStreams.push(...subscribers);

    // 최대 6명 표시
    const topStreams = allStreams.slice(0, 6);

    return (
      <div className="container">
        <h1>다람쥐 월드: {mySessionId}</h1>
        <button onClick={this.leaveSession}>Leave session</button>

        <div className="video-grid">
          {topStreams.map((stream, idx) => (
            <UserVideoComponent key={idx} streamManager={stream} />
          ))}
        </div>
      </div>
    );
  }
}

// useParams로 roomId 받는 Wrapper (없어도 되지만, 질문 코드에 있으므로 유지)
export default function OpenViduPageWrapper() {
  const { roomId } = useParams();
  return <OpenViduPage roomId={roomId} />;
}
