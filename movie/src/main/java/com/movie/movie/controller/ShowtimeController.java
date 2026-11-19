package com.movie.movie.controller;

import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.domain.enums.ShowtimeStatus;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.ShowtimeDto;
import com.movie.movie.dtos.ShowtimeRequest;
import com.movie.movie.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowtimeDto> create(@RequestBody ShowtimeRequest request) {
        ShowtimeDto dto = showtimeService.create(request);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeDto> getById(@PathVariable(name = "id") Long id) {
        ShowtimeDto dto = showtimeService.getById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<ShowtimeDto>> getAll() {
        List<ShowtimeDto> list = showtimeService.getAll();
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable(name = "id") Long id) {
        showtimeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowtimeDto> changeStatus(
            @PathVariable(name = "id") Long id,
            @RequestParam(name = "status") ShowtimeStatus status
    ) {
        ShowtimeDto dto = showtimeService.changeStatus(id, status);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}/movie-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShowtimeDto> changeMovieStatus(
            @PathVariable(name = "id") Long id,
            @RequestParam(name = "status") MovieStatus status
    ) {
        ShowtimeDto dto = showtimeService.changeMovieStatus(id, status);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/date")
    public ResponseEntity<List<ShowtimeDto>> getByDate(@RequestParam(name = "date") String date) {
        LocalDate parsedDate = LocalDate.parse(date, DATE_FORMATTER);
        List<ShowtimeDto> list = showtimeService.getByDate(parsedDate);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowtimeDto>> getByMovieId(@PathVariable(name = "movieId") Long movieId) {
        List<ShowtimeDto> list = showtimeService.getByMovieId(movieId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ShowtimeDto>> getByRoomAndDate(
            @PathVariable(name = "roomId") Long roomId,
            @RequestParam(name = "date") String date
    ) {
        LocalDate parsedDate = LocalDate.parse(date, DATE_FORMATTER);
        List<ShowtimeDto> list = showtimeService.getByRoomAndDate(roomId, parsedDate);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ShowtimeDto>> getByDateRange(
            @RequestParam(name = "start") String start,
            @RequestParam(name = "end") String end
    ) {
        LocalDate startDate = LocalDate.parse(start, DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(end, DATE_FORMATTER);
        List<ShowtimeDto> list = showtimeService.getByDateRange(startDate, endDate);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/available-rooms")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoomDto>> getAvailableRooms(@RequestParam(name = "date") String date) {
        LocalDate parsedDate = LocalDate.parse(date, DATE_FORMATTER);
        List<RoomDto> list = showtimeService.getAvailableRooms(parsedDate);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countDistinctMoviesByDate(@RequestParam(name = "date") String date) {
        LocalDate parsedDate = LocalDate.parse(date, DATE_FORMATTER);
        long count = showtimeService.countDistinctMoviesByDate(parsedDate);
        return ResponseEntity.ok(count);
    }
}