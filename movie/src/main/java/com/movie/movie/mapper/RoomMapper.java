package com.movie.movie.mapper;

import com.movie.movie.domain.Room;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.RoomRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    Room toEntity(RoomRequest roomRequest);

    RoomDto toDto(Room room);
}