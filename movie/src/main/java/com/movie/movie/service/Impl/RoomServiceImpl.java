package com.movie.movie.service.Impl;

import com.movie.movie.domain.Room;
import com.movie.movie.domain.enums.RoomType;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.RoomRequest;
import com.movie.movie.mapper.RoomMapper;
import com.movie.movie.repository.RoomRepository;
import com.movie.movie.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomMapper roomMapper;
    private final RoomRepository roomRepository;

    @Override
    public RoomDto create(RoomRequest roomRequest) {
        if (roomRepository.existsByName(roomRequest.getName())) {
            throw new IllegalArgumentException("A room with this name already exists.");
        }

        Room room = roomMapper.toEntity(roomRequest);
        Room saved = roomRepository.save(room);
        return roomMapper.toDto(saved);
    }

    @Override
    public RoomDto getById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + id));
        return roomMapper.toDto(room);
    }

    @Override
    public List<RoomDto> getAll() {
        return roomRepository.findAll().stream()
                .map(roomMapper::toDto)
                .toList();
    }

    @Override
    public RoomDto getByName(String name) {
        Room room = roomRepository.findByName(name);

        if (room == null) {
            throw new IllegalArgumentException("Room not found with name: " + name);
        }

        return roomMapper.toDto(room);
    }

    @Override
    public List<RoomDto> findByRoomType(RoomType roomType) {
        return roomRepository.findByRoomType(roomType).stream()
                .map(roomMapper::toDto)
                .toList();
    }
}