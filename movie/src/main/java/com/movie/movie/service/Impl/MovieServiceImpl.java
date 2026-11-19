package com.movie.movie.service.Impl;

import com.movie.movie.domain.Movie;
import com.movie.movie.dtos.MovieDto;
import com.movie.movie.dtos.MovieRequest;
import com.movie.movie.mapper.MovieMapper;
import com.movie.movie.repository.MovieRepository;
import com.movie.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final MovieRepository  movieRepository;
    private final MovieMapper movieMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public MovieDto create(MovieRequest movieRequest) {
        Movie movie = movieMapper.toEntity(movieRequest);
        Movie saved = movieRepository.save(movie);
        return movieMapper.toDto(saved);
    }

    @Override
    public MovieDto getById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found with id: " + id));
        return movieMapper.toDto(movie);
    }

    @Override
    public void delete(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new IllegalArgumentException("Movie not found with id: " + id);
        }
        movieRepository.deleteById(id);
    }

    @Override
    public Page<MovieDto> getAll(Pageable pageable) {
        return movieRepository.findAll(pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> searchByTitle(String title, Pageable pageable) {
        return movieRepository.findByTitleContainingIgnoreCase(title, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByStudio(String studio, Pageable pageable) {
        return movieRepository.findByStudioIgnoreCase(studio, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByLanguage(String language, Pageable pageable) {
        return movieRepository.findByLanguageIgnoreCase(language, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByDirector(String director, Pageable pageable) {
        return movieRepository.findByDirectorIgnoreCase(director, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByGenre(String genre, Pageable pageable) {
        return movieRepository.findByGenre(genre, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByGenresIn(List<String> genres, Pageable pageable) {
        return movieRepository.findByGenresIn(genres, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByReleaseDateBetween(String start, String end, Pageable pageable) {
        LocalDate startDate = LocalDate.parse(start, DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(end, DATE_FORMATTER);

        return movieRepository.findByReleaseDateBetween(startDate, endDate, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public Page<MovieDto> findByRatingGreaterThanEqual(Double minRating, Pageable pageable) {
        return movieRepository.findByOriginalRatingGreaterThanEqual(minRating, pageable)
                .map(movieMapper::toDto);
    }

    @Override
    public long countByGenre(String genre) {
        return movieRepository.countByGenre(genre);
    }

    @Override
    public long countByStudio(String studio) {
        return movieRepository.countByStudio(studio);
    }
}