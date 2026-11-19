package com.movie.movie.service;

import com.movie.movie.dtos.MovieDto;
import com.movie.movie.dtos.MovieRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MovieService {

    MovieDto create(MovieRequest movieRequest);

    MovieDto getById(Long id);

    void delete(Long id);

    Page<MovieDto> getAll(Pageable pageable);

    Page<MovieDto> searchByTitle(String title, Pageable pageable);

    Page<MovieDto> findByStudio(String studio, Pageable pageable);

    Page<MovieDto> findByLanguage(String language, Pageable pageable);

    Page<MovieDto> findByDirector(String director, Pageable pageable);

    Page<MovieDto> findByGenre(String genre, Pageable pageable);

    Page<MovieDto> findByGenresIn(List<String> genres, Pageable pageable);

    Page<MovieDto> findByReleaseDateBetween(String start, String end, Pageable pageable);

    Page<MovieDto> findByRatingGreaterThanEqual(Double minRating, Pageable pageable);

    long countByGenre(String genre);

    long countByStudio(String studio);
}