package com.movie.movie.mapper;

import com.movie.movie.domain.Movie;
import com.movie.movie.dtos.MovieDto;
import com.movie.movie.dtos.MovieRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    Movie toEntity(MovieRequest movieRequest);

    MovieDto toDto(Movie movie);
}