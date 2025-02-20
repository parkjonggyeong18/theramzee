
## THE RAMZEE

### 프로젝트 소개
- 마피아류 웹 게임으로 다람쥐를 통해 플레이합니다.
- 이메일 인증을 통해 회원가입을 하고 게임을 플레이 할 수 있습니다.
- 친구 추가를 통해 친구와 같이 플레이하고 채팅을 할 수 있습니다.
- 미니게임을 플레이하고 나쁜 다람쥐를 피해 미션을 모두 완수합니다. 미션을 모두 완수하지 못하면 투표를 통해 나쁜 다람쥐를 찾아내세요.
- 개발 기간 : 2024.01.06 ~ 02.20
- URL : https://RAMZEE.online/
<br>

### 구성원
<table>
  <tbody>
    <tr width='100%'>
      <th align="center" width='14%'>팀장</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
      <th align="center" width='14%'>팀원</th>
    </tr>
    <tr width='100%'>
      <th align="center" width='14%'>김선진</th>
      <th align="center" width='14%'>신경원</th>
      <th align="center" width='14%'>김경환</th>
      <th align="center" width='14%'>김승윤</th>
      <th align="center" width='14%'>박종경</th>
      <th align="center" width='14%'>이대현</th>
    </tr>
    <tr width='100%'>
      <th align="center" width='14%'>프론트앤드</th>
      <th align="center" width='14%'>프론트앤드, 디자인</th>
      <th align="center" width='14%'>백앤드</th>
      <th align="center" width='14%'>백앤드</th>
      <th align="center" width='14%'>백앤드</th>
      <th align="center" width='14%'>인프라</th>
    </tr>
  </tbody>
</table>
<br>

### 프로젝트 아키텍쳐

![image](https://github.com/user-attachments/assets/382a737b-e125-4fce-aa23-06f12e95ceba)
<br>

- FRONTEND : 클라이언트의 요청은 nginx를 통해서 들어오게 됩니다.  프론트엔드는 react로 구현되어 있으며, 사용자 인증 및 권한 관리를 위해 accessToken을 사용합니다.
- BACKEND : 프론트앤드에서 요청한 요청을 바탕으로 MySQL, Redis에 대이터를 저장 추출해 프론트로 전달합니다. 보안을 위해 springsecurity를 이용하여 구현되었으며, jwt를 활용해 사용자의 인증 및 권한 부여를 담당합니다.
- Redis : 게임 진행 정보, 방의 sessionId, 채팅기록든 빠른 요청과 휘발성 데이터들을 저장합니다.

### CI/CD
- GitLab를 통해 코드베이스를 관리하며 변경 사항을 병합하기 위해 Pull Request를 생성하고 팀원들을 이를 검토하고 코드 리뷰를 진행합니다.
PR가 merge되면 Jenkins을 통한 CI/CD가 시작됩니다. 이 파이프라인은 빌드를 자동으로 시작하고 빌드된 코드가 자동으로 배포가 진행됩니다.
- 또한, AWS의 Secure Key Manager를 사용하여 DB 정보를 비롯한 암호화가 필요한 중요한 데이터들을 안전하게 관리하고 환경변수를 통해 접근합니다.
<br>

### 개발환경
 - 개발도구: Intellij IDEA - Ultimate, VSCode
 - 빌드도구: Gradle
 - 데이터베이스
    - MySQL: 8.0.25
    - Redis : 7.2.1
 - ERD
    - ERDCloud
 - 개발 환경 및 언어
    - 언어:
      - HTML
      - CSS
      - JavaScript
      - Java
    - 라이브러리 및 프레임워크:
      - react
      - Spring Framework
      - Spring Boot
        - Spring Data
        - Spring Data JPA
        - Spring Data Elasticsearch
        - Spring Data Redis
        - Spring Security
        - JPA
 - AWS
    - Instance
    - Secure Key Manager
 - 형상관리 및 이슈관리
    - GitLab
    - Jira
 - 기타
    - Mattermost
    - jenkins
  
### 개발언어

<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
<img src="https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> 

### 사용도구

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"> <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"> <img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white"> <img src="https://img.shields.io/badge/spring boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/spring security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"> <img src="https://img.shields.io/badge/spring 
gateway-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> <img src="https://img.shields.io/badge/spring Data JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/spring Data Redis-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"/> 
<img src="https://img.shields.io/badge/websocket-010101?style=for-the-badge&logo=socket&logoColor=white">
<img src="https://img.shields.io/badge/spring Data Redis-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/OPENVIDU-333333?style=for-the-badge&logo=webrtc&logoColor=white">
<img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
 <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">

 

### etc
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"/> <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=mattermost&logoColor=white"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white"/>
  <img src="https://img.shields.io/badge/amazonwebservices-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white">
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white"/>
  <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white">
<br>

### ERD
![image](https://github.com/user-attachments/assets/4ecf95f6-741a-4f9f-9dda-3af8736f1e51)
<br>
### 기능 명세서
![image](https://github.com/user-attachments/assets/3dbbcbad-26c2-4a62-bd10-e5cf8b253e75)
https://www.notion.so/1749cc6dad12808aa476fffcc0e57079?v=6b7c044b0f0440eca1af93f8e86a80b0&pvs=4<br>
명확한 설계와 기능 명세를 통해 명확한 기능 구현을 진행했습니다.

### 형상관리 및 이슈관리
![image](https://github.com/user-attachments/assets/4da577d9-fc7f-4b65-a28b-814e8435b8e3)
Jira를 통해 한주의 스프린트를 정하고 백로그를 진행해 현재 작업 상황을 실시간으로 확인할 수 있도록 했습니다.

### 스크럼
개발 기간 동안 총 20번이 넘는 스크럼이 진행되었고, 스크럼에서는 팀원들이 각자의 진행 상황을 공유하고 발생한 이슈들을 함께 논의하여 프로젝트를 원활하게 진행할 수 있었습니다.
<br>

### 구성원 별 담당 내용

## :bust_in_silhouette: 박종경

> ### spring security

- jwt token 기반으로 회원 정보를 보관

- 외부 api 요청에 대한 권한 설정

> ### 회원

- 회원 정보 조회 기능

- 회원 정보 수정 기능
    - 비밀번호 변경
    - 닉네임 변경
    
- 회원 가입 기능
    - 회원 가입 시 회원 비밀번호 해싱
    - 이메일 인증을 통한 회원 가입

- 회원 탈퇴 기능

- 로그인
  - 로그인시 jwt 토큰을 발급해 사용자의 정보를 안전하게 보관
  - refresh 토큰은 redis에 저장해 빠른 사용 가능
    
> ### 친구

- 친구 목록 조회

- 친구 추가 기능
    - 친구 닉네임을 통해 친구 추가
    - WebSocket을 활용해 실시간으로 친구 추가 알림 전송
    
- 친구 삭제
  - WebSocket을 활용해 실시간으로 친구 삭제

-  친구 요청 목록 조회

> ### 채팅

- 친구의 닉네임을 통해 채팅

- 1:1 채팅
  - 1:1 채팅은 WebSocket을 활용해 실시간으로 대화 제공
  - 채팅 기록은 하루동안 redis에 보관
  - 친구가 채팅을 읽고 있지 않으면 redis에 읽지 않은 메시지를 카운트해 친구에게 제공
    
<br/>

## :bust_in_silhouette: 이대현

### EC2 인프라 환경 세팅

- **전체 아키텍쳐 설계**
- **서비스 SSL 보안 적용**  
  - Letsencrypt 및 Certbot을 이용하여 SSL 보안 적용
- **서버 구성 요소 설정**  
  - Nginx, Docker, MySQL, ufw 등
- **openvidu 환경 세팅**
- **환경변수 관리**  
  - .env 파일 작성

---

### FrontEnd / BackEnd EC2 배포

- **Dockerfile 작성 및 Config 파일 설정**
- **docker-compose 파일 설정**

---

### Nginx 웹서버 적용

- **Reverse Proxy 설정**  
  - 접근 제한 및 서비스 리다이렉트 적용
- **악성 봇 접근 차단**  
  - 브루트포스, 스크래핑 등 대응

---

### Jenkins CI/CD Pipeline 구축

- **Gitlab Webhook 연동**  
  - push 및 merge 시 Jenkins에 상태 전송 및 build 트리거
- **Docker Hub 이미지 배포**
- **EC2 서버 배포**  
  - 빌드한 이미지를 pull 받아 container 실행
- **Mattermost 연동**  
  - Jenkins build 정보 알림 메시지 봇 구현
<br/>


