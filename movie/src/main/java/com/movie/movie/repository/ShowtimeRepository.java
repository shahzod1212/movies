package com.movie.movie.repository;

import com.movie.movie.domain.Showtime;
import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.domain.enums.ShowtimeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("SELECT COUNT(DISTINCT s.movie.id) FROM Showtime s WHERE s.date = :date AND s.showtimeStatus <> 'CANCELLED'")
    long countDistinctMoviesByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(DISTINCT s.movie.id) FROM Showtime s WHERE s.date = :date AND s.room.id = :roomId AND s.showtimeStatus <> 'CANCELLED'")
    long countDistinctMoviesByDateAndRoom(@Param("date") LocalDate date, @Param("roomId") Long roomId);

    boolean existsByMovieIdAndDateAndShowtimeStatusNot(Long movieId, LocalDate date, ShowtimeStatus showtimeStatus);

    boolean existsByRoomIdAndDateAndShowtimeStatusNot(Long roomId, LocalDate date, ShowtimeStatus showtimeStatus);

    List<Showtime> findByRoomIdAndDate(Long roomId, LocalDate date);

    List<Showtime> findByDateAndShowtimeStatus(LocalDate date, ShowtimeStatus showtimeStatus);

    List<Showtime> findByMovieIdAndShowtimeStatus(Long movieId, ShowtimeStatus showtimeStatus);

    List<Showtime> findByMovieId(Long movieId);

    List<Showtime> findByDateBetweenAndShowtimeStatus(LocalDate start, LocalDate end, ShowtimeStatus showtimeStatus);

    List<Showtime> findByDateAndStatusIn(LocalDate date, Collection<MovieStatus> status);

    List<Showtime> findByDateLessThanEqualAndStatusIn(LocalDate date, Collection<MovieStatus> status);
}