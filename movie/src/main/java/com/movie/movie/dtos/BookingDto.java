package com.movie.movie.dtos;

import com.movie.movie.domain.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class BookingDto {

    private Long id;

    private Long userId;

    private Long showtimeId;

    private String movieTitle;

    private String roomName;

    private LocalDate showDate;

    private List<SeatDto> seats;
    private String checkoutSessionId;
    private String checkoutUrl;
    private Double totalAmount;

    private BookingStatus status;

    private LocalDateTime expiresAt;

    private LocalDateTime createdAt;
}