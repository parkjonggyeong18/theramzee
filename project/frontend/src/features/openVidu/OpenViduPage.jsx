import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import UserVideoComponent from './components/UserVideoComponent'; // 경로 확인 후 수정
import { useParams } from 'react-router-dom';
import axios from 'axios';

// OpenVidu 서버 주소
const APPLICATION_SERVER_URL = "http://localhost:4443";

class OpenViduPage extends Component {
    constructor(props) {
        super(props);

        const { roomId } = this.props; // `useParams()`를 통해 전달받은 roomId
        const sessionId = `${roomId}-1`; // "roomId-1" 형식으로 세션 ID 설정

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

    handleMainVideoStream = (stream) => {
        this.setState({ mainStreamManager: stream });
    };

    deleteSubscriber = (streamManager) => {
        this.setState({
            subscribers: this.state.subscribers.filter(sub => sub !== streamManager),
        });
    };

    joinSession = async () => {
        this.OV = new OpenVidu();
        const session = this.OV.initSession();

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            this.setState({ subscribers: [...this.state.subscribers, subscriber] });
        });

        session.on('streamDestroyed', (event) => {
            this.deleteSubscriber(event.stream.streamManager);
        });

        session.on('exception', (exception) => {
            console.warn(exception);
        });

        try {
            // ✅ sessionStorage에서 토큰 가져오기
            let token = sessionStorage.getItem('openViduToken');

            // ✅ 토큰이 없으면 새로 생성
            if (!token) {
                token = await this.getToken();
                sessionStorage.setItem('openViduToken', token);
            }

            // ✅ OpenVidu 세션 연결
            await session.connect(token, { clientData: this.state.myUserName });

            const publisher = await this.OV.initPublisherAsync(undefined, {
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                mirror: false,
            });

            session.publish(publisher);

            this.setState({
                session,
                mainStreamManager: publisher,
                publisher,
            });
        } catch (error) {
            console.log('There was an error connecting to the session:', error);
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
        const response = await axios.post(`${APPLICATION_SERVER_URL}/api/sessions`, { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    };

    createToken = async (sessionId) => {
        const response = await axios.post(`${APPLICATION_SERVER_URL}/api/sessions/${sessionId}/connections`, {}, {
            headers: { 'Content-Type': 'application/json' },
        });
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

// ✅ `useParams`로 `roomId` 받아서 `OpenViduPage`에 전달
export default function OpenViduPageWrapper() {
    const { roomId } = useParams();
    return <OpenViduPage roomId={roomId} />;
}
