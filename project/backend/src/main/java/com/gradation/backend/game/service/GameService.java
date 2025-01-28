//package com.gradation.backend.game.service;
//
//import com.gradation.backend.common.model.response.BaseResponse;
//import com.gradation.backend.game.model.Dto;
//import com.gradation.backend.game.model.request;
//import com.gradation.backend.game.model.response;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class GameService {
//    private final RedisTemplate<String, Object> redisTemplate;
//
//    public response.GameStartResponse initializeGame(request.GameStartRequest request) {
//        // Initialize 6 forests
//        List<Dto.ForestDto> forests = initializeForests();
//
//        // Set initial game state
//        setInitialGameState(request.getUser());
//
//        // Assign roles (evil/good squirrel)
//        boolean isEvilSquirrel = assignRole(request.getUser());
//
//        return new GameStartResponse(forests,
//                calculateTotalAcorns(),
//                request.getUser().getAcorns(),
//                getTimeLimit(),
//                isEvilSquirrel);
//    }
//
//
//
//
