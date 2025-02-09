import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserVideoComponent from './components/UserVideoComponent';

class OpenViduPage extends Component {
  constructor(props) {
    super(props);
    this.navigate = props.navigate; // useNavigate 훅을 받아오기
    this.state = {
      mySessionId: props.roomId + '-1',  // 세션 ID (방번호-1)
      session: undefined,               // 세션 객체
      previewPublisher: undefined,      // 미리보기용 퍼블리셔
      publisher: undefined,            // 세션 publish용 퍼블리셔
      mainStreamManager: undefined,     // 내 카메라 스트림
      subscribers: [],                  // 다른 참가자들의 스트림
      randomNick: 'Participant_' + Math.floor(Math.random() * 100000), // 임의 닉네임
    };
  }

  componentDidMount() {
    // 새로고침/창닫기 시 leaveSession
    window.addEventListener('beforeunload', this.leaveSession);
  }
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.leaveSession);
  }

  /**
   * 카메라 미리보기
   * - 미리보기용 퍼블리셔 생성
   */
  initPreview = async () => {
    try {
      this.OV = new OpenVidu();
      const previewPublisher = await this.OV.initPublisherAsync(undefined, {
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        mirror: false,
      });
      this.setState({ previewPublisher });
    } catch (err) {
      console.error('카메라 미리보기 실패:', err);
    }
  };

  /**
   * 방에 입장
   * - 세션 생성, 토큰으로 connect, 미리보기 퍼블리셔 publish
   */
  joinSession = async () => {
    const { previewPublisher, randomNick } = this.state;
    if (!previewPublisher) {
      alert("먼저 카메라 미리보기를 진행해주세요.");
      return;
    }
    try {
      // OpenVidu 객체가 없으면 재생성
      if (!this.OV) this.OV = new OpenVidu();
      const session = this.OV.initSession();

      // 이벤트 리스너 등록
      session.on('streamCreated', (e) => {
        const subscriber = session.subscribe(e.stream, undefined);
        this.setState((prev) => ({
          subscribers: [...prev.subscribers, subscriber],
        }));
      });
      session.on('streamDestroyed', (e) => {
        this.setState((prev) => ({
          subscribers: prev.subscribers.filter((sub) => sub !== e.stream.streamManager),
        }));
      });
      // session.on('connectionCreated', () => {
      //   if (session.connections.size > 6) {
      //     alert('이미 6명이 접속중입니다.');
      //     session.disconnect();
      //   }
      // });

      // 세션 토큰 가져오기
      const token = sessionStorage.getItem('openViduToken');
      if (!token) {
        alert('토큰이 없습니다. 다시 시도해주세요.');
        // 방 목록으로 이동
        this.navigate('/rooms');
        return;
      }

      // 세션 연결 (옵션: clientData에 닉네임 전달)
      await session.connect(token, { clientData: randomNick });

      // 미리보기 퍼블리셔를 세션에 publish
      await session.publish(previewPublisher);

      // 상태 갱신
      this.setState({
        session,
        publisher: previewPublisher,
        mainStreamManager: previewPublisher,
      });
    } catch (err) {
      console.error('세션 연결 오류:', err);
    }
  };

  /**
   * 세션에서 나가기 (연결 해제)
   */
  leaveSession = () => {
    const { session } = this.state;
    if (session) session.disconnect();
    if (this.OV) this.OV = null;
    this.setState({
      session: undefined,
      previewPublisher: undefined,
      publisher: undefined,
      mainStreamManager: undefined,
      subscribers: [],
    });
  };

  /**
   * 방 목록(rooms)으로 돌아가기
   * - 세션 연결 해제 후 페이지 이동
   */
  leaveRoom = () => {
    this.leaveSession();
    this.navigate('/rooms');
  };

  render() {
    const {
      session,
      previewPublisher,
      mainStreamManager,
      subscribers,
      randomNick,
    } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        {/* 세션에 아직 입장 전(미리보기 단계) */}
        {session === undefined ? (
          <div style={{ textAlign: 'center' }}>
            {/* 미리보기를 시작하기 전 */}
            {!previewPublisher && (
              <button onClick={this.initPreview} style={{ marginBottom: '1rem' }}>
                카메라 미리보기
              </button>
            )}

            {/* 미리보기 중 */}
            {previewPublisher && (
              <>
                <div style={{ width: '640px', height: '480px', margin: '0 auto', position: 'relative' }}>
                  <UserVideoComponent streamManager={previewPublisher} />
                  {/* 닉네임 표시 (영상 위에 겹치지 않도록 절대 위치) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}>
                    {randomNick}
                  </div>
                </div>
                <button onClick={this.joinSession} style={{ marginTop: '1rem' }}>
                  방 입장하기
                </button>
                {/* 나가기 버튼: 미리보기 하다가도 rooms로 돌아가고 싶다면 */}
                <button onClick={this.leaveRoom} style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                  방 목록으로
                </button>
              </>
            )}
          </div>
        ) : (
          // 세션에 입장한 후
          <div style={{ textAlign: 'center' }}>
            {/* 내 카메라 스트림 (메인 화면) */}
            {mainStreamManager && (
              <div style={{ width: '640px', height: '480px', margin: '0 auto', position: 'relative' }}>
                <UserVideoComponent streamManager={mainStreamManager} />
                {/* 내 닉네임 */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}>
                  {randomNick}
                </div>
              </div>
            )}

            {/* 다른 참가자들 스트림 */}
            {subscribers.map((sub, idx) => (
              <div
                key={idx}
                style={{ width: '320px', height: '240px', margin: '1rem auto', position: 'relative' }}
              >
                <UserVideoComponent streamManager={sub} />
                {/* 여기도 필요하다면 해당 참가자의 닉네임 표시 가능
                  const data = sub.stream.connection.data; // "Participant_12345" 등
                  <div style={{ position:'absolute', bottom:'8px', ... }}>{data}</div>
                */}
              </div>
            ))}

            {/* 나가기 버튼: 세션 해제 후 rooms로 이동 */}
            <button onClick={this.leaveRoom} style={{ marginTop: '1rem' }}>
              방 목록으로
            </button>
          </div>
        )}
      </div>
    );
  }
}

/**
 * OpenViduPageWrapper
 * - useParams()로 roomId, useNavigate()로 페이지 이동 기능을 받아
 *   OpenViduPage 컴포넌트에 전달
 */
export default function OpenViduPageWrapper() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  return <OpenViduPage roomId={roomId} navigate={navigate} />;
}
