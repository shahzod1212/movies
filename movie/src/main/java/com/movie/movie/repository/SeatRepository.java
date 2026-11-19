package com.movie.movie.repository;

import com.movie.movie.domain.Seat;
import com.movie.movie.domain.enums.SeatSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByRoomId(Long roomId);

    boolean existsByRoomId(Long roomId);

    Optional<Seat> findByRoomIdAndRowLabelAndSeatNumber(Long roomId, String rowLabel, Integer seatNumber);

    List<Seat> findByRoomIdAndSection(Long roomId, SeatSection section);

}