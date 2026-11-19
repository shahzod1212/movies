package com.movie.movie.mapper;

import com.movie.movie.domain.Movie;
import com.movie.movie.domain.Showtime;
import com.movie.movie.dtos.ShowtimeDto;
import com.movie.movie.dtos.ShowtimeRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {

    Showtime toEntity(ShowtimeRequest request);

    ShowtimeDto toDto(Showtime showtime);
}
