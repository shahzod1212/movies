package com.movie.movie.dtos;

import com.movie.movie.domain.Movie;
import com.movie.movie.domain.Room;
import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.domain.enums.ShowtimeStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShowtimeDto {
    private Long id;
    private Movie movie;
    private Room room;
    private LocalDate date;
    private LocalTime startTime;
    private Integer durationHour;
    private Integer durationMinute;
    private MovieStatus status;
    private ShowtimeStatus showtimeStatus;
}
