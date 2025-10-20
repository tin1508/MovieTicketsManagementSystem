package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.entity.Movie;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    Movie toMovie(MovieCreationRequest request);
    MovieResponse toMovieResponse(Movie movie);
    GenreResponse toGenreResponse(Genre genre);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateMovie(@MappingTarget Movie movie, MovieUpdateRequest request);
}
