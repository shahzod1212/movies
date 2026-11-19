package com.movie.movie.repository;

import com.movie.movie.domain.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    Page<Movie> findByStudioIgnoreCase(String studio, Pageable pageable);

    Page<Movie> findByLanguageIgnoreCase(String language, Pageable pageable);

    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Movie> findByReleaseDateBetween(LocalDate start, LocalDate end, Pageable pageable);

    Page<Movie> findByDirectorIgnoreCase(String director, Pageable pageable);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g = :genre")
    Page<Movie> findByGenre(@Param("genre") String genre, Pageable pageable);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g IN :genres")
    Page<Movie> findByGenresIn(@Param("genres") List<String> genres, Pageable pageable);

    @Query("SELECT COUNT(m) FROM Movie m JOIN m.genres g WHERE g = :genre")
    long countByGenre(@Param("genre") String genre);

    @Query("SELECT m FROM Movie m WHERE m.rating >= :minRating")
    Page<Movie> findByOriginalRatingGreaterThanEqual(@Param("minRating") Double minRating, Pageable pageable);

    @Query("SELECT COUNT(m) FROM Movie m WHERE m.studio = :studio")
    long countByStudio(@Param("studio") String studio);
}