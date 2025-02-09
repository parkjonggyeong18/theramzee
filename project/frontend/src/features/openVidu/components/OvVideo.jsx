// OpenViduVideoComponent.jsx
import React, { Component, createRef } from 'react';

// 내부 클래스 컴포넌트: forwardedRef라는 prop으로 전달받은 ref를 사용합니다.
class OpenViduVideoComponentInner extends Component {
  constructor(props) {
    super(props);
    // 만약 부모에서 ref를 전달받았다면 그걸 사용하고, 아니면 내부에서 새로 생성합니다.
    this.videoRef = this.props.forwardedRef || createRef();
  }

  componentDidMount() {
    if (this.props.streamManager && this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  componentDidUpdate() {
    if (this.props.streamManager && this.videoRef.current) {
      this.props.streamManager.addVideoElement(this.videoRef.current);
    }
  }

  render() {
    return <video autoPlay={true} ref={this.videoRef} />;
  }
}

// forwardRef를 사용하여 부모의 ref를 forwardedRef prop으로 전달합니다.
const OpenViduVideoComponent = React.forwardRef((props, ref) => {
  return <OpenViduVideoComponentInner {...props} forwardedRef={ref} />;
});

export default OpenViduVideoComponent;
