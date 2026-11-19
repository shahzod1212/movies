package com.movie.movie.service.Impl;

import com.movie.movie.domain.*;
import com.movie.movie.domain.enums.BookingStatus;
import com.movie.movie.domain.enums.SeatSection;
import com.movie.movie.dtos.BookingDto;
import com.movie.movie.dtos.BookingRequest;
import com.movie.movie.mapper.BookingMapper;
import com.movie.movie.repository.*;
import com.movie.movie.service.BookingService;
import com.movie.movie.service.CustomerSupportService;
import com.movie.movie.service.PaymentService;
import com.movie.movie.service.PdfTicketService;
import com.stripe.model.checkout.Session;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingMapper bookingMapper;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final PaymentService paymentService;
    private final PdfTicketService pdfTicketService;
    private final CustomerSupportService customerSupportService;

    @Override
    @Transactional
    public BookingDto create(BookingRequest request, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        Room room = roomRepository.findById(showtime.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        List<Seat> seats = new ArrayList<>();
        Double total = 0.0;

        for (Long id : request.getSeatIds()) {
            Seat seat = seatRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));

            boolean isTaken = bookingRepository.isSeatTakenForShowtime(seat.getId(), showtime.getId());
            if (isTaken) {
                throw new RuntimeException("Seat " + seat.getRowLabel() + seat.getSeatNumber() + " is already taken, please select another one");
            }

            if (seat.getSection() == SeatSection.FRONT) {
                total += room.getFrontPrice();
            } else if (seat.getSection() == SeatSection.TOP) {
                total += room.getTopPrice();
            } else if (seat.getSection() == SeatSection.MIDDLE) {
                total += room.getMiddlePrice();
            } else {
                total += room.getWingPrice();
            }

            seats.add(seat);
        }

        Booking booking = new Booking();
        booking.setSeats(seats);
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        booking.setTotalAmount(total);

        Booking savedBooking = bookingRepository.save(booking);

        String checkoutUrl;
        try {
            Session session = paymentService.createCheckoutSession(
                    savedBooking.getId(), savedBooking.getTotalAmount(), showtime.getMovie().getTitle());
            checkoutUrl = session.getUrl();
            savedBooking.setCheckoutSessionId(checkoutUrl);
            savedBooking = bookingRepository.save(savedBooking);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment session: " + e.getMessage(), e);
        }

        BookingDto dto = bookingMapper.toDto(savedBooking);
        dto.setCheckoutUrl(checkoutUrl);
        return dto;
    }

    @Override
    public BookingDto getById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return bookingMapper.toDto(booking);
    }

    @Override
    public List<BookingDto> getByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(bookingMapper::toDto)
                .toList();
    }

    @Override
    public List<BookingDto> getByUserIdAndStatus(Long userId, BookingStatus status) {
        return bookingRepository.findByUserIdAndStatus(userId, status).stream()
                .map(bookingMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public BookingDto confirmPayment(String checkoutSessionId) {
        Booking booking = bookingRepository.findByCheckoutSessionId(checkoutSessionId)
                .orElseThrow(() -> new RuntimeException("Booking not found for this checkout session"));

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            return bookingMapper.toDto(booking);
        }

        try {
            boolean paid = paymentService.isPaymentSuccessful(checkoutSessionId);

            if (!paid) {
                throw new RuntimeException("Payment has not been completed for this booking");
            }

            String paymentIntentId = paymentService.getPaymentIntentId(checkoutSessionId);
            booking.setPaymentIntentId(paymentIntentId);
            booking.setStatus(BookingStatus.CONFIRMED);

            Booking savedBooking = bookingRepository.save(booking);

            byte[] pdfFile = pdfTicketService.generateTicket(savedBooking);
            String bookingRef = "BK-" + String.format("%06d", savedBooking.getId());

            customerSupportService.sendTicketEmail(
                    savedBooking.getUser().getEmail(),
                    savedBooking.getUser().getUsername(),
                    savedBooking.getShowtime().getMovie().getTitle(),
                    bookingRef,
                    pdfFile
            );

            return bookingMapper.toDto(savedBooking);
        } catch (Exception e) {
            throw new RuntimeException("Failed to confirm payment: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public BookingDto cancel(Long id, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            return bookingMapper.toDto(booking);
        }

        if (booking.getStatus() == BookingStatus.EXPIRED) {
            throw new RuntimeException("This booking has already expired and cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toDto(savedBooking);
    }

    @Override
    @Transactional
    public void releaseExpiredBookings() {
        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore(
                BookingStatus.PENDING, LocalDateTime.now());

        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.EXPIRED);
        }

        bookingRepository.saveAll(expiredBookings);
    }

    @Override
    public long countBookedSeatsByShowtime(Long showtimeId) {
        return bookingRepository.countBookedSeatsByShowtime(showtimeId);
    }

    @Override
    public boolean isSeatAvailable(Long seatId, Long showtimeId) {
        return !bookingRepository.isSeatTakenForShowtime(seatId, showtimeId);
    }

    @Override
    public List<Long> getTakenSeatIds(Long showtimeId) {
        return bookingRepository.findTakenSeatIdsByShowtime(showtimeId);
    }
}