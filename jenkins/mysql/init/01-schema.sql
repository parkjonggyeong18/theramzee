-- 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS gradation_db;
USE gradation_db;

-- 유저 테이블
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     email VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 게임 테이블
CREATE TABLE IF NOT EXISTS games (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     title VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 게임 참가자 테이블
CREATE TABLE IF NOT EXISTS game_participants (
                                                 id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                                 game_id BIGINT,
                                                 user_id BIGINT,
                                                 score INT DEFAULT 0,
                                                 FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
