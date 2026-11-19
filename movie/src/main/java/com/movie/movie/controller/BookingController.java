package com.movie.movie.controller;

import com.movie.movie.domain.User;
import com.movie.movie.domain.enums.BookingStatus;
import com.movie.movie.dtos.BookingDto;
import com.movie.movie.dtos.BookingRequest;
import com.movie.movie.repository.UserRepository;
import com.movie.movie.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<BookingDto> create(
            @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        Long userId = getCurrentUserId(authentication);
        BookingDto dto = bookingService.create(request, userId);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/confirm")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<BookingDto> confirmPayment(@RequestParam(name = "sessionId") String sessionId) {
        BookingDto dto = bookingService.confirmPayment(sessionId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<BookingDto> getById(@PathVariable(name = "id") Long id) {
        BookingDto dto = bookingService.getById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<BookingDto>> getMyBookings(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<BookingDto> list = bookingService.getByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/me/status")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<BookingDto>> getMyBookingsByStatus(
            @RequestParam(name = "status") String status,
            Authentication authentication
    ) {
        BookingStatus bookingStatus = BookingStatus.valueOf(status);
        Long userId = getCurrentUserId(authentication);
        List<BookingDto> list = bookingService.getByUserIdAndStatus(userId, bookingStatus);
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<BookingDto> cancel(
            @PathVariable(name = "id") Long id,
            Authentication authentication
    ) {
        Long userId = getCurrentUserId(authentication);
        BookingDto dto = bookingService.cancel(id, userId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/showtime/{showtimeId}/taken-seats")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<Long>> getTakenSeatIds(@PathVariable(name = "showtimeId") Long showtimeId) {
        List<Long> list = bookingService.getTakenSeatIds(showtimeId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/showtime/{showtimeId}/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countBookedSeatsByShowtime(@PathVariable(name = "showtimeId") Long showtimeId) {
        long count = bookingService.countBookedSeatsByShowtime(showtimeId);
        return ResponseEntity.ok(count);
    }

    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        return user.getId();
    }
}