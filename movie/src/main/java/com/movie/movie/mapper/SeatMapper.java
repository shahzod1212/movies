package com.movie.movie.mapper;

import com.movie.movie.domain.Seat;
import com.movie.movie.dtos.SeatDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SeatMapper {

    @Mapping(target = "roomId", source = "room.id")
    SeatDto toDto(Seat seat);
}
