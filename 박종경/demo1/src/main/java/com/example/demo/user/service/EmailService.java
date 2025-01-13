package com.example.demo.user.service;

public interface EmailService {
    public void mailSend(String setFrom, String toMail, String title, String content);

    public String joinEmail(String email);

    public void makeRandomNum();

    public Boolean checkAuthNum(String email, String authNum);
}
