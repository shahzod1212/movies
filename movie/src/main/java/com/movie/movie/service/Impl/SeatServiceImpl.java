package com.movie.movie.service.Impl;

import com.movie.movie.dtos.SeatDto;
import com.movie.movie.mapper.SeatMapper;
import com.movie.movie.repository.SeatRepository;
import com.movie.movie.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;
    @Override
    public List<SeatDto> getAllSeatByRoom(Long id) {
        return seatRepository.findByRoomId(id)
                .stream()
                .map(seatMapper::toDto)
                .toList();
    }
}
