package com.moviebooking.movie_service.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

//@Mapper(componentModel = "spring")
//public interface ShowtimesMapper {
//    Showtimes toShowtimes(ShowtimesCreationRequest request);
//    ShowtimesResponse toShowtimesResponse(Showtimes showtimes);
//
//    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
//    void updateShowtimes(@MappingTarget Showtimes showtimes, ShowtimesUpdateRequest request);
//}