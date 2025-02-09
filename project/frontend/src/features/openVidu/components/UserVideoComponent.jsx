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
      : "Unknown";
  }

  render() {
    if (!this.props.streamManager) return null;

    return (
      // position: relative를 주어 내부의 canvas(오버레이)가 video 위에 올 수 있도록 함
      <div className="streamcomponent" style={{ position: 'relative' }}>
        {/* OpenViduVideoComponent에 ref를 전달하여 내부 video element에 접근할 수 있도록 합니다. */}
        <OpenViduVideoComponent streamManager={this.props.streamManager} ref={this.videoRef} />
        {/* videoRef를 MediaPipeOverlay에 전달하여 video의 프레임을 처리하고 canvas를 오버레이합니다. */}
        <MediaPipeOverlay videoRef={this.videoRef} width={640} height={480} />
        <div>
          <p>{this.getNicknameTag()}</p>
        </div>
      </div>
    );
  }
}
