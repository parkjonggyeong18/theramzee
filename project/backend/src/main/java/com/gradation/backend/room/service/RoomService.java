package com.gradation.backend.room.service;

import com.gradation.backend.room.model.dto.RoomDto;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomDto createRoom(String title) {
        Room room = new Room(title);
        Room savedRoom = roomRepository.save(room);

        return new RoomDto(savedRoom.getRoomId(),
                savedRoom.getTitle(),
                savedRoom.getGameStatus(),
                savedRoom.getHost());
    }

    public List<RoomDto> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(room -> new RoomDto(room.getId(), room.getName()))
                .collect(Collectors.toList());
    }
}
