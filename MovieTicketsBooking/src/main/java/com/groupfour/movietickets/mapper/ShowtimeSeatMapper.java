package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.request.ShowtimeSeatCreationRequest;
import com.groupfour.movietickets.dto.request.ShowtimeSeatUpdateRequest;
import com.groupfour.movietickets.dto.response.ShowtimeSeatResponse;
import com.groupfour.movietickets.entity.Booking;
import com.groupfour.movietickets.entity.ShowtimeSeat;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ShowtimeSeatMapper {
    ShowtimeSeat toShowtimeSeat(ShowtimeSeatCreationRequest request);
    ShowtimeSeatResponse toShowtimeSeatResponse(ShowtimeSeat showtimeSeat);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateShowtimeSeat(@MappingTarget ShowtimeSeat showtimeSeat, ShowtimeSeatUpdateRequest request);
}
