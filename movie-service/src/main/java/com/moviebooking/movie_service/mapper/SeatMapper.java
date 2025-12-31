package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.SeatUpdateRequest;
import com.moviebooking.movie_service.dto.response.SeatResponse;
import com.moviebooking.movie_service.entity.Seat;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = {SeatTypeMapper.class, RoomMapper.class})
public interface SeatMapper {
    SeatResponse toSeatResponse(Seat seat);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSeat(@MappingTarget Seat seat, SeatUpdateRequest request);
}