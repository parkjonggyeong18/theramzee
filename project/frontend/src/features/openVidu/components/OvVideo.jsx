// OpenViduVideoComponent.jsx
import React, { Component, createRef } from 'react';

export default class OpenViduVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }
  }

    componentDidMount() {
        // Mount 시점에 video 요소 등록
        if (this.props.streamManager && this.videoRef.current) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }
  

    componentDidUpdate(prevProps) {
        // 만약 streamManager가 바뀌었다면 재등록
        if (
            this.props.streamManager !== prevProps.streamManager &&
            this.props.streamManager &&
            this.videoRef.current
        ) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return (
            <video
                ref={this.videoRef}
                autoPlay
                // ▼ 부모가 크기를 줄이면 이 안에서도 축소되도록 처리
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', 
                    // 'cover'는 화면을 꽉 채우되 비율 유지. 넘치는 부분은 잘림
                    // 'contain'으로 바꾸면 비율유지 + 전체 표시(주변 여백 생길 수 있음)
                }}
            />
        );
    }

