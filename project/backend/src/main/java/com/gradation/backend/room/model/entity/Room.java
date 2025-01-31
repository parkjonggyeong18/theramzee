package com.gradation.backend.room.model.entity;

import com.gradation.backend.user.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Room")
public class Room {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(length = 100)
    private String title;

    @Column
    private Integer password;

    @Column(name = "game_status", nullable = false)
    private Boolean gameStatus;

    @OneToOne
    @JoinColumn(name = "host_id", foreignKey = @ForeignKey(name = "FK_user_name"), nullable = false)
    private User host;
}
