import React, { Component, createRef } from 'react';
import OpenViduVideoComponent from './OvVideo';
import MediaPipeOverlay from './MediaPipeOverlay';

export default class UserVideoComponent extends Component {
  constructor(props) {
    super(props);
    // video element의 참조를 생성합니다.
    this.videoRef = createRef();
  }

    getNicknameTag() {
        return this.props.streamManager?.stream?.connection?.data
            ? JSON.parse(this.props.streamManager.stream.connection.data).clientData
            : "Unknown"; // 기본 닉네임
    }

    render() {
        if (!this.props.streamManager) return null;

        // 컨테이너에 원하는 크기, 스타일 지정
        const containerStyle = {
            width: '200px',
            height: '150px',
            margin: '5px',
            overflow: 'hidden',
            backgroundColor: '#000',
            display: 'inline-block', // 옆으로 나란히 배치 가능
        };

        return (
            <div className="streamcomponent" style={containerStyle}>
                {/* 실제 비디오 렌더링 */}
                <OpenViduVideoComponent streamManager={this.props.streamManager} />
            </div>
        );
    }
}
