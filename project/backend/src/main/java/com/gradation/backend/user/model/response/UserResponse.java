package com.gradation.backend.user.model.response;

import com.gradation.backend.friends.entitiy.Friends;
import com.gradation.backend.room.model.entity.Room;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserResponse {
    private String username;
    private String name;
    private String nickname;
    private String password;
    private String email;
}
