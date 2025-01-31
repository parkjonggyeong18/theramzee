package com.gradation.backend.openvidu.exception;

import com.gradation.backend.common.model.response.BaseResponse;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class OpenViduExceptionHandler {

    // 오픈비두 클라이언트 에러
    @ExceptionHandler(OpenViduJavaClientException.class)
    public ResponseEntity<BaseResponse<String>> handleOpenViduJavaClientException(OpenViduJavaClientException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.error("OpenVidu Client Exception: " + e.getMessage()));
    }

    // 오픈비두 HTT

    @ExceptionHandler(OpenViduHttpException.class)
    public ResponseEntity<BaseResponse<String>> handleOpenViduHttpException(OpenViduHttpException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.error("OpenVidu HTTP Exception: " + e.getMessage()));
    }
}
