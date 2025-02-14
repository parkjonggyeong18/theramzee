package com.gradation.backend.openvidu.service;

import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;

public interface OpenViduService {

    /**
     * 새로운 세션 생성
     *
     * @param sessionId 세션 ID (roomId와 동일하게 사용)
     * @return 생성된 세션 객체
     * @throws OpenViduJavaClientException OpenVidu 클라이언트 예외
     * @throws OpenViduHttpException       OpenVidu HTTP 예외
     */
    Session createSession(String sessionId) throws OpenViduJavaClientException, OpenViduHttpException;

    /**
     * 세션에 참여하기 위한 토큰 생성
     *
     * @param sessionId 세션 ID
     * @param nickname  사용자 닉네임
     * @return 생성된 토큰 문자열
     * @throws OpenViduJavaClientException OpenVidu 클라이언트 예외
     * @throws OpenViduHttpException       OpenVidu HTTP 예외
     */
<<<<<<< HEAD
    public String generateToken(String sessionId, String nickname) throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openVidu.getActiveSession(sessionId);

        if (session == null) {
            throw new IllegalArgumentException("세션을 찾을 수 없습니다. 세션 ID: " + sessionId);
        }

        ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
                .type(ConnectionType.WEBRTC)
                .role(OpenViduRole.PUBLISHER) // 동영상 전송과 스트림
                .data(nickname)
                .kurentoOptions(
                        new KurentoOptions.Builder()
                                .allowedFilters(new String[]{"GStreamerFilter", "FaceOverlayFilter"})
                                .build())
                .build();

        Connection connection = session.createConnection(connectionProperties);
        String token = connection.getToken();
        System.out.println("generated token:" + token);

        return token;
    }
=======
    String generateToken(String sessionId, String nickname) throws OpenViduJavaClientException, OpenViduHttpException;
>>>>>>> develop
}
