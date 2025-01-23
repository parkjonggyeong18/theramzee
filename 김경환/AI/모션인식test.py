import cv2
import mediapipe as mp

# MediaPipe Pose 모듈 초기화
mp_pose = mp.solutions.pose  # Pose 추정을 위한 MediaPipe Pose 모듈 로드
pose = mp_pose.Pose(
    static_image_mode=False,  # 비디오 처리를 위해 False로 설정
    min_detection_confidence=0.5,  # 포즈 감지를 위한 최소 신뢰도 임계값
    min_tracking_confidence=0.5  # 포즈 추적을 위한 최소 신뢰도 임계값
)
mp_drawing = mp.solutions.drawing_utils  # 감지된 포즈를 그리기 위한 유틸리티

# 비디오 입력 설정
video_path = "test.MOV"  # 분석할 비디오 파일 경로 지정
cap = cv2.VideoCapture(video_path)  # 비디오 캡처 객체 생성

# 비디오 출력 설정
output_path = "output_video.avi"  # 처리된 비디오를 저장할 경로
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))  # 입력 비디오의 프레임 너비
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))  # 입력 비디오의 프레임 높이
fps = int(cap.get(cv2.CAP_PROP_FPS))  # 입력 비디오의 FPS
# XVID 코덱을 사용하여 출력 비디오 작성자 객체 생성
out = cv2.VideoWriter(output_path, cv2.VideoWriter_fourcc(*'XVID'), fps, (frame_width, frame_height))

# 이전 프레임의 어깨 위치 추적을 위한 변수 초기화
prev_left_shoulder_y = None
prev_right_shoulder_y = None

def detect_shoulder_drop(prev_y, current_y, threshold=0.02):
    """
    어깨의 하향 움직임을 감지하는 함수
    
    Args:
        prev_y: 이전 프레임의 어깨 Y 좌표
        current_y: 현재 프레임의 어깨 Y 좌표
        threshold: 움직임 감지를 위한 임계값 (기본값: 0.02)
    
    Returns:
        bool: 어깨가 임계값 이상으로 아래로 움직였으면 True, 아니면 False
    """
    if prev_y is not None and (current_y - prev_y) > threshold:
        return True
    return False

# 메인 비디오 처리 루프
while cap.isOpened():
    ret, frame = cap.read()  # 비디오에서 프레임 읽기
    if not ret:
        break  # 더 이상 프레임이 없으면 종료

    # 이미지 전처리
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # BGR을 RGB로 변환 (MediaPipe 요구사항)
    image.flags.writeable = False  # 성능 최적화를 위해 이미지 읽기 전용으로 설정
    
    # MediaPipe를 사용하여 포즈 감지
    results = pose.process(image)
    
    # 이미지 후처리
    image.flags.writeable = True  # 이미지 쓰기 가능하도록 설정
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # RGB를 BGR로 다시 변환
    
    # 감지된 포즈 처리 및 시각화
    if results.pose_landmarks:
        # 감지된 포즈 랜드마크 그리기
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        landmarks = results.pose_landmarks.landmark

        # 현재 프레임의 어깨 위치 추출
        left_shoulder_y = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y
        right_shoulder_y = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y

        # 어깨 하향 움직임 감지 및 경고
        if detect_shoulder_drop(prev_left_shoulder_y, left_shoulder_y):
            print("왼쪽 어깨가 아래로 움직였습니다! 허리를 피세요!!")
        if detect_shoulder_drop(prev_right_shoulder_y, right_shoulder_y):
            print("오른쪽 어깨가 아래로 움직였습니다!")

        # 다음 프레임 비교를 위해 현재 어깨 위치 저장
        prev_left_shoulder_y = left_shoulder_y
        prev_right_shoulder_y = right_shoulder_y
    
    # 결과 화면 표시 및 저장
    cv2.imshow('Pose Detection', image)  # 처리된 프레임 화면에 표시
    out.write(image)  # 처리된 프레임을 출력 비디오에 저장

    # 'q' 키를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 리소스 해제
cap.release()
out.release()
cv2.destroyAllWindows()