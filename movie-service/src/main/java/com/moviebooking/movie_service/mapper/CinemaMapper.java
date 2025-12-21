package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.CinemaCreationRequest;
import com.moviebooking.movie_service.dto.request.CinemaUpdateRequest;
import com.moviebooking.movie_service.dto.response.CinemaResponse;
import com.moviebooking.movie_service.entity.Cinema;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CinemaMapper {
    Cinema toCinema(CinemaCreationRequest request);

    CinemaResponse toCinemaResponse(Cinema cinema);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCinema(@MappingTarget Cinema cinema, CinemaUpdateRequest request);
}
