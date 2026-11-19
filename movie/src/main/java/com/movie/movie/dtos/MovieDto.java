package com.movie.movie.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String durationTime;
    private LocalDate releaseDate;
    private List<String> genres;
    private String language;
    private Map<String, String> actors;
    private String director;
    private Double rating;
    private Double originalRating;
    private String studio;
    private String filmingLocation;
    private String ageRating;
    private List<String> formats;
    private LocalDateTime createdAt;
}