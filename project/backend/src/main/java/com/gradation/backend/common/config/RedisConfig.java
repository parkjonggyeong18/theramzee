package com.gradation.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * RedisConfig는 Redis와의 통신을 위한 설정을 제공합니다.
 * RedisTemplate을 Bean으로 정의하여 Redis 데이터 처리를 지원합니다.
 */
@Configuration
public class RedisConfig {
    
    /**
     * RedisTemplate Bean 정의.
     *
     * @return {@link RedisTemplate} 객체로, Redis와의 데이터 작업을 수행할 수 있습니다.
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        // RedisTemplate 생성 및 설정
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Key와 Value 직렬화 설정
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        return template;
    }

    @Bean
    public RedisConnectionFactory redisConnectionFactoryDb1() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory();
        factory.setDatabase(1); // 1번 데이터베이스 설정
        return factory;
    }

    @Bean(name = "redisTemplateDb1")
    public RedisTemplate<String, Object> redisTemplateDb1(RedisConnectionFactory redisConnectionFactoryDb1) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactoryDb1);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

        return template;
    }
}
