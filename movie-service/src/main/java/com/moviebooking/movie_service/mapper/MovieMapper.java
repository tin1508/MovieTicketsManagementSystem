package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    Movie toMovie(MovieCreationRequest request);
    MovieResponse toMovieResponse(Movie movie);

    @Mapping(target = "id", ignore = true)
    void updateMovie(@MappingTarget Movie movie, MovieUpdateRequest request);
}
