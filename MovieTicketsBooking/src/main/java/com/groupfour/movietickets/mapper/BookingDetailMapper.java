package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.BookingDetailCreationRequest;
import com.groupfour.movietickets.dto.request.BookingDetailUpdateRequest;
import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingDetailResponse;
import com.groupfour.movietickets.entity.Booking;
import com.groupfour.movietickets.repository.BookingDetailRepository;
import org.mapstruct.*;
import com.groupfour.movietickets.entity.BookingDetail;

@Mapper(componentModel = "spring")
public interface BookingDetailMapper {

    BookingDetail toBookingDetail(BookingDetailCreationRequest request);
    BookingDetailResponse toBookingDetailResponse(BookingDetail bookingDetail);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBookingDetail(@MappingTarget BookingDetail bookingDetail, BookingDetailUpdateRequest request);
}
