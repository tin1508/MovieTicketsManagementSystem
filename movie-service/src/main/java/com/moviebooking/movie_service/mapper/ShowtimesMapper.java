package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.ShowtimesCreationRequest;
import com.moviebooking.movie_service.dto.request.ShowtimesUpdateRequest;
import com.moviebooking.movie_service.dto.response.ShowtimesResponse;
import com.moviebooking.movie_service.entity.Showtimes;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = {RoomMapper.class, MovieMapper.class})
public interface ShowtimesMapper {
    Showtimes toShowtimes(ShowtimesCreationRequest request);

    ShowtimesResponse toShowtimesResponse(Showtimes showtimes);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateShowtimes(@MappingTarget Showtimes showtimes, ShowtimesUpdateRequest request);
}