package com.movie.movie.mapper;

import com.movie.movie.domain.Booking;
import com.movie.movie.dtos.BookingDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = SeatMapper.class)
public interface BookingMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "showtimeId", source = "showtime.id")
    @Mapping(target = "movieTitle", source = "showtime.movie.title")
    @Mapping(target = "roomName", source = "showtime.room.name")
    @Mapping(target = "showDate", source = "showtime.date")
    @Mapping(target = "seats", source = "seats")
    BookingDto toDto(Booking booking);
}