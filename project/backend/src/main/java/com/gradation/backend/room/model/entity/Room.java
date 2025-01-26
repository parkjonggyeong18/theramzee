package com.gradation.backend.room.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "room")
public class Room {

    @Id
    @Column(name="room_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(length = 100)
    private String title;

    @Column(nullable = true)
    private Integer password;

    @Column(name = "game_status", nullable = false)
    private Boolean gameStatus;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "host_id", foreignKey = @ForeignKey(name = "FK_user_name"), nullable = false)
//    private User host;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", foreignKey = @ForeignKey(name = "FK_user_name"), nullable = false)
    private FakeUser fakeHost;

    @OneToMany(mappedBy = "room", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private List<FakeUser> fakeUsers = new ArrayList<>();

    /**
     * 참여자 추가
     *
     * @param fakeUser
     */
    public void addFakeUser(FakeUser fakeUser) {
        this.fakeUsers.add(fakeUser);
        fakeUser.setRoom(this);   // 양방향 동기화
    }

    /**
     * 방 생성 메서드 (호스트 자동 참가)
     *
     * @param title
     * @param password
     * @param fakeHost
     * @return Room
     */
    public static Room createRoom(String title, Integer password, FakeUser fakeHost) {
        Room room = new Room();
        room.setTitle(title);
        room.setPassword(password);
        room.setGameStatus(false);
        room.setFakeHost(fakeHost);
        room.addFakeUser(fakeHost);

        return room;
    }

    /**
     * 참여자 제거 메서드 (양방향 연관관계 유지)
     *
     * @param user
     */
    public void removeFakeUser(FakeUser user) {
        fakeUsers.remove(user);
        user.setRoom(null);
    }
}
