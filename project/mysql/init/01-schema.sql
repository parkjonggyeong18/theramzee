-- 기존 데이터베이스가 있으면 삭제 ( 수정 필요 )
DROP DATABASE IF EXISTS gradation_db;

-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS gradation_db;
USE gradation_db;

-- User 테이블
CREATE TABLE IF NOT EXISTS User (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    room_id INT UNSIGNED NULL,
    login_root VARCHAR(10) NOT NULL,
    user_status BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);

-- Room 테이블
CREATE TABLE IF NOT EXISTS Room (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NULL,
    password INT NULL,
    host_id INT UNSIGNED NOT NULL,
    game_status BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_user_name FOREIGN KEY (host_id) REFERENCES User(id) ON DELETE CASCADE
);

-- User 테이블 외래 키 추가
ALTER TABLE User
ADD CONSTRAINT FK_User_Room FOREIGN KEY (room_id) REFERENCES Room(id) ON DELETE SET NULL;

-- Friends 참가자 테이블
CREATE TABLE IF NOT EXISTS Friends (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    friends_id INT UNSIGNED NOT NULL,
    status ENUM('REQUESTED', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'REQUESTED',
    PRIMARY KEY (id),
    CONSTRAINT FK_Friends_User FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    CONSTRAINT FK_Friends_Friend FOREIGN KEY (friends_id) REFERENCES User(id) ON DELETE CASCADE
);
