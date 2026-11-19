package com.movie.movie.service;

import com.movie.movie.domain.enums.RoomType;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.RoomRequest;

import java.util.List;

public interface RoomService {

    RoomDto create(RoomRequest roomRequest);

    RoomDto getById(Long id);

    List<RoomDto> getAll();

    RoomDto getByName(String name);

    List<RoomDto> findByRoomType(RoomType roomType);
}