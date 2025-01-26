package com.gradation.backend.room.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "fake_user")
public class FakeUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 10, unique = true)
    private String nickname;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String email;

    @Column(name = "login_root", nullable = false, length = 10)
    private String loginRoot;

    @Column(name = "user_status", nullable = false)
    private Boolean userStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", foreignKey = @ForeignKey(name = "FK_User_Room"))
    private Room room;


    /**
     *
     * @param username
     * @param name
     * @param nickname
     * @param password
     * @param email
     * @param loginRoot
     * @return
     */
    public static FakeUser createFakeUser(String username,
                                          String name,
                                          String nickname,
                                          String password,
                                          String email,
                                          String loginRoot) {
        FakeUser fakeUser = new FakeUser();
        fakeUser.setUsername(username);
        fakeUser.setName(name);
        fakeUser.setNickname(nickname);
        fakeUser.setPassword(password);
        fakeUser.setEmail(email);
        fakeUser.setLoginRoot(loginRoot);
        fakeUser.setUserStatus(true);

        return fakeUser;
    }
}
