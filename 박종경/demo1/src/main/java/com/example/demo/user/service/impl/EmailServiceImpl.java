package com.example.demo.user.service.impl;

import com.example.demo.common.config.RedisConfig;
import com.example.demo.user.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender; // 이메일 전송을 위한 JavaMailSender 객체
    @Autowired
    private RedisConfig redisConfig; // Redis 설정 객체, RedisTemplate을 사용하기 위해 주입

    private int authNumber; // 생성된 인증 번호를 저장하는 변수

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    /* 이메일 발신자 주소 (application.properties에서 주입) */
    @Value("${spring.mail.username}")
    private String serviceName; // 이메일 발신자의 주소 (예: no-reply@example.com)

    /**
     * 랜덤 인증번호 생성 메서드
     * - 6자리 랜덤 숫자를 생성하여 `authNumber` 변수에 저장합니다.
     * - 회원가입 시 이메일 인증에서 사용할 인증번호를 생성하는 데 사용됩니다.
     */
    public void makeRandomNum() {
        Random r = new Random(); // 랜덤 객체 생성
        String randomNumber = "";

        // 6자리 숫자 생성
        for (int i = 0; i < 6; i++) {
            randomNumber += Integer.toString(r.nextInt(10)); // 0~9 사이의 정수를 문자열로 변환하여 연결
        }

        authNumber = Integer.parseInt(randomNumber); // 문자열을 정수로 변환하여 저장
    }

    /**
     * 이메일 전송 메서드
     * - 이메일을 생성 후 발송하며, 발송된 인증번호를 Redis에 저장합니다.
     * - 인증번호는 3분(180초)의 유효기간을 가집니다.
     *
     * @param setFrom 발신자의 이메일 주소
     * @param toMail  수신자의 이메일 주소
     * @param title   이메일 제목
     * @param content 이메일 본문 (HTML 형식 지원)
     * @author 박종경
     */
    public void mailSend(String setFrom, String toMail, String title, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true);
            javaMailSender.send(message); // 이메일 전송
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        // RedisTemplate 사용
        ValueOperations<String, String> valOperations = redisTemplate.opsForValue();
        String redisKey = "email:auth:" + toMail;
        valOperations.set(redisKey, Integer.toString(authNumber), 180, TimeUnit.SECONDS);
    }

    /**
     * 이메일 인증 요청 처리 메서드
     * - 랜덤 인증 번호를 생성하고, 사용자 이메일로 인증 메일을 발송합니다.
     *
     * @param email 사용자 이메일 주소
     * @return 생성된 인증 번호
     * @author 박종경
     */
    public String joinEmail(String email) {
        makeRandomNum(); // 랜덤 인증 번호 생성

        String customerMail = email; // 수신자 이메일 주소
        String title = "회원 가입을 위한 이메일입니다!"; // 이메일 제목
        String content = // 이메일 본문
                "이메일을 인증하기 위한 절차입니다." +
                        "<br><br>" +
                        "인증 번호는 " + authNumber + "입니다." +
                        "<br>" +
                        "회원 가입 폼에 해당 번호를 입력해주세요.";

        mailSend(serviceName, customerMail, title, content); // 이메일 발송
        return Integer.toString(authNumber); // 생성된 인증 번호 반환
    }

    /**
     * 인증번호 확인 메서드
     * - Redis에서 저장된 인증 번호를 조회하여 사용자가 입력한 인증 번호와 일치 여부를 확인합니다.
     *
     * @param email   사용자 이메일 주소
     * @param authNum 사용자가 입력한 인증 번호
     * @return 인증 성공 여부 (true / false)
     * @author 박종경
     */
    public Boolean checkAuthNum(String email, String authNum) {
        ValueOperations<String, String> valOperations = redisTemplate.opsForValue();
        String code = valOperations.get(email);

        return Objects.equals(code, authNum); // 인증 결과 반환
    }
}


