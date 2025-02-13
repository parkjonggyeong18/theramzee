import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        try {
            return JSON.parse(this.props.streamManager?.stream?.connection?.data || '{}').clientData || 'Guest';
        } catch (error) {
            console.error("Error parsing nickname:", error);
            return 'Guest';
        }
    }

    render() {
        return (
            <div>
                {this.props.streamManager !== undefined ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        <div><p>{this.getNicknameTag()}</p></div>
                    </div>
                ) : null}
            </div>
        );
    }
}
