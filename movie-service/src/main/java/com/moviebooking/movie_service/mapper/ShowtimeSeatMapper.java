package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.response.ShowtimeSeatResponse;
import com.moviebooking.movie_service.entity.ShowtimeSeat;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ShowtimeSeatMapper {
    ShowtimeSeatResponse toShowtimeSeatResponse(ShowtimeSeat showtimeSeat);
}
