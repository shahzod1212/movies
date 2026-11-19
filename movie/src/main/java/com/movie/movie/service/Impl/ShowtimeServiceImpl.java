package com.movie.movie.service.Impl;

import com.movie.movie.domain.Movie;
import com.movie.movie.domain.Room;
import com.movie.movie.domain.Showtime;
import com.movie.movie.domain.enums.MovieStatus;
import com.movie.movie.domain.enums.ShowtimeStatus;
import com.movie.movie.dtos.RoomDto;
import com.movie.movie.dtos.ShowtimeDto;
import com.movie.movie.dtos.ShowtimeRequest;
import com.movie.movie.mapper.RoomMapper;
import com.movie.movie.mapper.ShowtimeMapper;
import com.movie.movie.repository.MovieRepository;
import com.movie.movie.repository.RoomRepository;
import com.movie.movie.repository.ShowtimeRepository;
import com.movie.movie.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private static final int DAILY_MOVIE_LIMIT = 8;
    private static final int ROOM_DAILY_LIMIT = 2;

    private final ShowtimeMapper showtimeMapper;
    private final RoomMapper roomMapper;
    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;

    @Override
    @Transactional
    public ShowtimeDto create(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("The selected movie could not be found."));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("The selected room could not be found."));

        if (request.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Showtimes can only be scheduled for today or a future date.");
        }

        long distinctMovieCount = showtimeRepository.countDistinctMoviesByDate(request.getDate());
        if (distinctMovieCount >= DAILY_MOVIE_LIMIT) {
            throw new RuntimeException("The maximum number of movies for " + request.getDate() + " has already been scheduled.");
        }

        List<Showtime> roomShowtimes = showtimeRepository.findByRoomIdAndDate(request.getRoomId(), request.getDate());
        if (roomShowtimes.size() >= ROOM_DAILY_LIMIT) {
            throw new RuntimeException("This room already has the maximum of " + ROOM_DAILY_LIMIT + " showtimes scheduled for " + request.getDate() + ".");
        }

        Showtime showtime = showtimeMapper.toEntity(request);

        LocalTime newEndTime = showtime.getStartTime()
                .plusHours(showtime.getDurationHour())
                .plusMinutes(showtime.getDurationMinute());

        for (Showtime existing : roomShowtimes) {
            LocalTime existingEndTime = existing.getStartTime()
                    .plusHours(existing.getDurationHour())
                    .plusMinutes(existing.getDurationMinute());

            boolean overlaps = showtime.getStartTime().isBefore(existingEndTime)
                    && newEndTime.isAfter(existing.getStartTime());

            if (overlaps) {
                throw new RuntimeException("This time slot conflicts with an existing showtime in this room. Please choose a different room or time.");
            }
        }

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStatus(MovieStatus.UPCOMING);
        showtime.setShowtimeStatus(ShowtimeStatus.SCHEDULED);

        Showtime saved = showtimeRepository.save(showtime);
        return showtimeMapper.toDto(saved);
    }

    @Override
    public ShowtimeDto getById(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("The requested showtime could not be found."));
        return showtimeMapper.toDto(showtime);
    }

    @Override
    public List<ShowtimeDto> getAll() {
        return showtimeRepository.findAll().stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!showtimeRepository.existsById(id)) {
            throw new RuntimeException("The showtime you are trying to delete could not be found.");
        }
        showtimeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ShowtimeDto changeStatus(Long id, ShowtimeStatus status) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("The requested showtime could not be found."));

        showtime.setShowtimeStatus(status);
        Showtime saved = showtimeRepository.save(showtime);
        return showtimeMapper.toDto(saved);
    }

    @Override
    @Transactional
    public ShowtimeDto changeMovieStatus(Long id, MovieStatus status) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("The requested showtime could not be found."));
        showtime.setStatus(status);
        Showtime saved = showtimeRepository.save(showtime);
        return showtimeMapper.toDto(saved);
    }

    @Override
    public List<ShowtimeDto> getByDate(LocalDate date) {
        return showtimeRepository.findByDateAndShowtimeStatus(date, ShowtimeStatus.SCHEDULED).stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    @Override
    public List<ShowtimeDto> getByMovieId(Long movieId) {
        return showtimeRepository.findByMovieId(movieId).stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    @Override
    public List<ShowtimeDto> getByRoomAndDate(Long roomId, LocalDate date) {
        return showtimeRepository.findByRoomIdAndDate(roomId, date).stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    @Override
    public List<ShowtimeDto> getByDateRange(LocalDate start, LocalDate end) {
        return showtimeRepository.findByDateBetweenAndShowtimeStatus(start, end, ShowtimeStatus.SCHEDULED).stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    @Override
    public List<RoomDto> getAvailableRooms(LocalDate date) {
        List<Room> rooms = roomRepository.findAll();
        List<RoomDto> availableRooms = new ArrayList<>();

        for (Room room : rooms) {
            List<Showtime> roomShowtimes = showtimeRepository.findByRoomIdAndDate(room.getId(), date);
            if (roomShowtimes.size() < ROOM_DAILY_LIMIT) {
                availableRooms.add(roomMapper.toDto(room));
            }
        }

        return availableRooms;
    }

    @Override
    public long countDistinctMoviesByDate(LocalDate date) {
        return showtimeRepository.countDistinctMoviesByDate(date);
    }
}