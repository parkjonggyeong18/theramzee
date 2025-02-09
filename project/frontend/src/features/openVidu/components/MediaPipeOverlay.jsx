// MediaPipeOverlay.jsx
import React, { useRef, useEffect } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

const MediaPipeOverlay = ({ videoRef, width = 640, height = 480 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // videoRef가 준비되지 않았다면 아무 작업도 하지 않음
    if (!videoRef.current) return;

    // FaceMesh 인스턴스 생성
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    // FaceMesh 결과 처리 함수
    const onResults = (results) => {
      // 캔버스 초기화
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // 배경으로 비디오 프레임을 그림
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // 얼굴 랜드마크가 있으면 빨간 점으로 그리기
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          for (const landmark of landmarks) {
            const x = landmark.x * canvasElement.width;
            const y = landmark.y * canvasElement.height;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 2, 0, 2 * Math.PI);
            canvasCtx.fillStyle = 'red';
            canvasCtx.fill();
          }
        }
      }
      canvasCtx.restore();
    };

    faceMesh.onResults(onResults);

    // MediaPipe Camera를 사용하여 videoRef에서 프레임을 가져와 FaceMesh에 전달
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: width,
      height: height,
    });
    camera.start();

    // 정리(cleanup)
    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, [videoRef, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none' // 캔버스가 클릭 이벤트를 방해하지 않도록
      }}
      width={width}
      height={height}
    />
  );
};

export default MediaPipeOverlay;
