import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import UserVideoComponent from './components/UserVideoComponent'; // 경로 확인 후 수정
import { useParams } from 'react-router-dom';
import axios from 'axios';

// OpenVidu 서버 주소
const APPLICATION_SERVER_URL = "http://localhost:8080";

class OpenViduPage extends Component {
  constructor(props) {
    super(props);

    const { roomId } = this.props;
    const sessionId = `${roomId}-1`;

    this.state = {
      mySessionId: sessionId,
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.leaveSession);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.leaveSession);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  deleteSubscriber = (streamManager) => {
    this.setState((prevState) => ({
      subscribers: prevState.subscribers.filter((sub) => sub !== streamManager),
    }));
  };

  joinSession = async () => {
    this.OV = new OpenVidu();
    const session = this.OV.initSession();

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      this.setState((prevState) => ({
        subscribers: [...prevState.subscribers, subscriber],
      }));
    });

    session.on('streamDestroyed', (event) => {
      this.deleteSubscriber(event.stream.streamManager);
    });

    session.on('exception', (exception) => {
      console.warn(exception);
    });

    try {
      let token = sessionStorage.getItem('openViduToken');
      if (!token) {
        token = await this.getToken();
        sessionStorage.setItem('openViduToken', token);
      }

      await session.connect(token, { clientData: this.state.myUserName });

      const publisher = await this.OV.initPublisherAsync(undefined, {
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        mirror: false,
      });

      // 자신의 스트림을 구독하여 서버에서 처리된(필터 적용된) 영상 출력
      publisher.subscribeToRemote();

      await session.publish(publisher);

      // 테스트: 음수 값 대신 0.0을 사용하여 문제 여부 확인
      const overlayParams = {
        uri: "https://cdn.pixabay.com/photo/2017/09/30/09/29/cowboy-hat-2801582_960_720.png",
        offsetXPercent: 0.000001,   // 0 대신 미세한 값 사용
        offsetYPercent: 0.000001,   // 0 대신 미세한 값 사용
        widthPercent: 1.5,          // 1.5는 문제가 없을 가능성이 큽니다.
        heightPercent: 1.0          // 필요하면 1.000001로 시도해볼 수도 있음.
      };

      setTimeout(async () => {
        try {
          const filter = await publisher.stream.applyFilter("FaceOverlayFilter");
          console.log("FaceOverlayFilter가 적용되었습니다:", filter);
          
          // execMethod 호출: overlayParams는 객체 그대로 전달
          await filter.execMethod("setOverlayedImage", overlayParams);
          console.log("오버레이 이미지가 정상적으로 설정되었습니다.");
        } catch (error) {
          console.error("필터 적용 또는 오버레이 이미지 설정 중 오류 발생:", error);
        }
      }, 1000);

      this.setState({
        session: session,
        mainStreamManager: publisher,
        publisher: publisher,
      });
    } catch (error) {
      console.error('세션 연결 중 오류 발생:', error);
    }
  };

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
    });
  };

  getToken = async () => {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  };

  createSession = async (sessionId) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/api/sessions`,
      { customSessionId: sessionId },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  };

  createToken = async (sessionId) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/api/sessions/${sessionId}/connections`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  };

  render() {
    return (
      <div className="container">
        {this.state.session === undefined ? (
          <div id="join">
            <h1>Join a video session</h1>
            <input
              type="text"
              name="myUserName"
              value={this.state.myUserName}
              onChange={this.handleChange}
            />
            <button onClick={this.joinSession}>JOIN</button>
          </div>
        ) : (
          <div id="session">
            <h1>{this.state.mySessionId}</h1>
            <button onClick={this.leaveSession}>Leave session</button>
            {this.state.mainStreamManager && (
              <UserVideoComponent streamManager={this.state.mainStreamManager} />
            )}
            <div id="video-container">
              {this.state.subscribers.map((sub, i) => (
                <UserVideoComponent key={i} streamManager={sub} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default function OpenViduPageWrapper() {
  const { roomId } = useParams();
  return <OpenViduPage roomId={roomId} />;
}
