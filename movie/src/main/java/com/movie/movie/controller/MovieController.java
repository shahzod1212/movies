package com.movie.movie.controller;

import com.movie.movie.dtos.MovieDto;
import com.movie.movie.dtos.MovieRequest;
import com.movie.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {
    private final MovieService movieService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieDto> create(
            @RequestBody MovieRequest movieRequest
    ){
        MovieDto dto = movieService.create(movieRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<MovieDto> getById(
            @PathVariable(name = "id") Long id
    ){
        MovieDto dto = movieService.getById(id);
        return ResponseEntity.ok().body(dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(
            @PathVariable(name = "id") Long id
    ){
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> getAll(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.getAll(pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> searchByTitle(
            @RequestParam(name = "title") String title,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.searchByTitle(title, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/studio")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> findByStudio(
            @RequestParam(name = "studio") String studio,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByStudio(studio, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/language")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> findByLanguage(
            @RequestParam(name = "language") String language,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByLanguage(language, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/director")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> findByDirector(
            @RequestParam(name = "director") String director,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByDirector(director, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/genre")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> findByGenre(
            @RequestParam(name = "genre") String genre,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByGenre(genre, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/genres")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> findByGenresIn(
            @RequestParam(name = "genres") List<String> genres,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByGenresIn(genres, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/search-date")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> getByDateBetween(
            @RequestParam(name = "start") String start,
            @RequestParam(name = "end") String end,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByReleaseDateBetween(start, end, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/rating")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Page<MovieDto>> findByRatingGreaterThanEqual(
            @RequestParam(name = "minRating") Double minRating,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<MovieDto> result = movieService.findByRatingGreaterThanEqual(minRating, pageable);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/count/genre")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Long> countByGenre(
            @RequestParam(name = "genre") String genre
    ){
        long count = movieService.countByGenre(genre);
        return ResponseEntity.ok().body(count);
    }

    @GetMapping("/count/studio")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Long> countByStudio(
            @RequestParam(name = "studio") String studio
    ){
        long count = movieService.countByStudio(studio);
        return ResponseEntity.ok().body(count);
    }
}