package com.movie.movie.service;

import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.domain.enums.ShowtimeStatus;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.ShowtimeDto;
import com.movie.movie.dtos.ShowtimeRequest;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {

    ShowtimeDto create(ShowtimeRequest request);

    ShowtimeDto getById(Long id);

    List<ShowtimeDto> getAll();

    void delete(Long id);

    ShowtimeDto changeStatus(Long id, ShowtimeStatus status);

    ShowtimeDto changeMovieStatus(Long id, MovieStatus status);

    List<ShowtimeDto> getByDate(LocalDate date);

    List<ShowtimeDto> getByMovieId(Long movieId);

    List<ShowtimeDto> getByRoomAndDate(Long roomId, LocalDate date);

    List<ShowtimeDto> getByDateRange(LocalDate start, LocalDate end);

    List<RoomDto> getAvailableRooms(LocalDate date);

    long countDistinctMoviesByDate(LocalDate date);
}