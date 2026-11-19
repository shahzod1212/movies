package com.movie.movie.controller;

import com.movie.movie.dtos.SeatDto;
import com.movie.movie.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;

    @GetMapping("/room/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<SeatDto>> getAllSeatByRoom(
            @PathVariable(name = "roomId") Long roomId
    ) {
        List<SeatDto> seats = seatService.getAllSeatByRoom(roomId);
        return ResponseEntity.ok().body(seats);
    }
}