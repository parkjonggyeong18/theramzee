package com.gradation.backend.room.model.request;

import lombok.Data;

@Data
public class CreateRoomRequest {
        private String title;        // 방 제목
<<<<<<< HEAD
        private Integer password;       // 방 비밀번호 (없으면 null)
=======
        private Integer password;       // 방 비밀번호 (없으면 null)         // 방 생성자
>>>>>>> 7bedab95993718149e3ad38c094d34e57a2dcb1c
        // 테스트 단에서는 룸서비스 내부에서 호스트 임의로 넣어주고 있어서 제외시킴 이후 security에서 생성자 정보 가져와야 할듯
}

