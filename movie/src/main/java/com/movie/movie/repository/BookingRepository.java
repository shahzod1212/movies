package com.movie.movie.repository;

import com.movie.movie.domain.Booking;
import com.movie.movie.domain.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    Optional<Booking> findByCheckoutSessionId(String checkoutSessionId);

    List<Booking> findByShowtimeIdAndStatusIn(Long showtimeId, List<BookingStatus> statuses);

    List<Booking> findByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime now);

    @Query("SELECT COUNT(s) FROM Booking b JOIN b.seats s WHERE b.showtime.id = :showtimeId AND b.status IN ('PENDING', 'CONFIRMED')")
    long countBookedSeatsByShowtime(@Param("showtimeId") Long showtimeId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b JOIN b.seats s " +
            "WHERE s.id = :seatId AND b.showtime.id = :showtimeId AND b.status IN ('PENDING', 'CONFIRMED')")
    boolean isSeatTakenForShowtime(@Param("seatId") Long seatId, @Param("showtimeId") Long showtimeId);

    @Query("SELECT s.id FROM Booking b JOIN b.seats s WHERE b.showtime.id = :showtimeId AND b.status IN ('PENDING', 'CONFIRMED')")
    List<Long> findTakenSeatIdsByShowtime(@Param("showtimeId") Long showtimeId);
}