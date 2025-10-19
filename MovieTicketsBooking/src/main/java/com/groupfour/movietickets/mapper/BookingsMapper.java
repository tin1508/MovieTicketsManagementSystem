package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.BookingCreationRequest;
import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingsResponse;
import com.groupfour.movietickets.entity.Booking;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BookingsMapper {

    @Mapping(source = "orgPrice", target = "totalPrice")
    Booking toBooking(BookingCreationRequest request);


    BookingsResponse toBookingResponse(Booking booking);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);
}
