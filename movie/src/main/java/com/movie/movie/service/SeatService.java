package com.movie.movie.service;

import com.movie.movie.dtos.SeatDto;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public interface SeatService {
    List<SeatDto> getAllSeatByRoom(Long id);
}

