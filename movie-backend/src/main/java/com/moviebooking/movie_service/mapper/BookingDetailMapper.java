package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.BookingDetailCreationRequest;
import com.moviebooking.movie_service.dto.request.BookingDetailUpdateRequest;
import com.moviebooking.movie_service.dto.response.BookingDetailResponse;
import com.moviebooking.movie_service.entity.BookingDetail;
import org.mapstruct.*;


@Mapper(componentModel = "spring")
public interface BookingDetailMapper {

    BookingDetail toBookingDetail(BookingDetailCreationRequest request);
    BookingDetailResponse toBookingDetailResponse(BookingDetail bookingDetail);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBookingDetail(@MappingTarget BookingDetail bookingDetail, BookingDetailUpdateRequest request);
}