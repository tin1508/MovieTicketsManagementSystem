package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.GenreCreationRequest;
import com.moviebooking.movie_service.dto.request.GenreUpdateRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.entity.Genre;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    Genre toGenre(GenreCreationRequest request);
    GenreResponse toGenreResponse(Genre genre);

    @Mapping(target = "id", ignore = true)
    void updateGenre(@MappingTarget Genre genre, GenreUpdateRequest request);
}
