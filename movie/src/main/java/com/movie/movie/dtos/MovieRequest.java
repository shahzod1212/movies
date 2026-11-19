package com.movie.movie.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MovieRequest {
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
    private Double originalRating;
    private String studio;
    private String filmingLocation;
    private String ageRating;
    private List<String> formats;
}