import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        // 사용자 닉네임을 안전하게 가져옴
        return this.props.streamManager?.stream?.connection?.data
            ? JSON.parse(this.props.streamManager.stream.connection.data).clientData
            : "Unknown"; // 기본 닉네임 설정
    }

    render() {
        if (!this.props.streamManager) return null; // streamManager가 없으면 아무것도 렌더링하지 않음.

        return (
            <div className="streamcomponent">
                <OpenViduVideoComponent streamManager={this.props.streamManager} />
                <div><p>{this.getNicknameTag()}</p></div>
            </div>
        );
    }
}
