package com.movie.movie.service;

import com.movie.movie.domain.enums.BookingStatus;
import com.movie.movie.dtos.BookingDto;
import com.movie.movie.dtos.BookingRequest;

import java.util.List;

public interface BookingService {

    BookingDto create(BookingRequest request, Long userId);

    BookingDto getById(Long id);

    List<BookingDto> getByUserId(Long userId);

    List<BookingDto> getByUserIdAndStatus(Long userId, BookingStatus status);

    BookingDto confirmPayment(String paymentIntentId);

    BookingDto cancel(Long id, Long userId);

    void releaseExpiredBookings();

    long countBookedSeatsByShowtime(Long showtimeId);

    boolean isSeatAvailable(Long seatId, Long showtimeId);

    List<Long> getTakenSeatIds(Long showtimeId);
}