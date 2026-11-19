package com.movie.movie.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShowtimeRequest {
    private Long movieId;
    private Long roomId;
    private LocalDate date;
    private LocalTime startTime;
    private Integer durationHour;
    private Integer durationMinute;
}
