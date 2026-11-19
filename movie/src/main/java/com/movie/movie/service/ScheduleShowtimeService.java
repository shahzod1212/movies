package com.movie.movie.service;

import com.movie.movie.domain.Showtime;
import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleShowtimeService {

    private final ShowtimeRepository showtimeRepository;

    @Scheduled(cron = "0 */5 * * * *")
    public void updateShowtimeStatuses() {
        List<Showtime> list = showtimeRepository.findByDateLessThanEqualAndStatusIn(
                LocalDate.now(),
                List.of(MovieStatus.UPCOMING, MovieStatus.NOW_SHOWING)
        );

        for (Showtime showtime : list) {
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();

            LocalTime endTime = showtime.getStartTime()
                    .plusHours(showtime.getDurationHour())
                    .plusMinutes(showtime.getDurationMinute());

            boolean isPastDay = showtime.getDate().isBefore(today);
            boolean hasStarted = isPastDay || now.isAfter(showtime.getStartTime());
            boolean hasEnded = isPastDay || now.isAfter(endTime);

            MovieStatus newStatus = null;

            if (hasEnded) {
                newStatus = MovieStatus.ENDED;
            } else if (hasStarted) {
                newStatus = MovieStatus.NOW_SHOWING;
            }

            if (newStatus != null && newStatus != showtime.getStatus()) {
                showtime.setStatus(newStatus);
                showtimeRepository.save(showtime);
            }
        }
    }
}