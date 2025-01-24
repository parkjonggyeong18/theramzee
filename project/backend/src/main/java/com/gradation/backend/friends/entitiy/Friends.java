package com.gradation.backend.friends.entitiy;

import com.gradation.backend.user.model.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Friends")
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_Friends_User"), nullable = false)
    private User user; // User와의 다대일 관계

    @ManyToOne
    @JoinColumn(name = "friends_id", foreignKey = @ForeignKey(name = "FK_Friends_Friend"), nullable = false)
    private User friend; // 친구 사용자와의 다대일 관계

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('REQUESTED', 'ACCEPTED', 'REJECTED')")
    private FriendStatus status;
}
