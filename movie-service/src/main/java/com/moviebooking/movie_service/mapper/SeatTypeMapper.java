package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.SeatTypeCreationRequest;
import com.moviebooking.movie_service.dto.request.SeatTypeUpdateRequest;
import com.moviebooking.movie_service.dto.response.SeatTypeResponse;
import com.moviebooking.movie_service.entity.SeatType;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface SeatTypeMapper {
    SeatType toSeatType(SeatTypeCreationRequest request);
    SeatTypeResponse toSeatTypeResponse(SeatType seatType);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSeatType(@MappingTarget SeatType seatType, SeatTypeUpdateRequest request);
}