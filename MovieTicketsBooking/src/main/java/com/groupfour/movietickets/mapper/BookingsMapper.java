package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.BookingCreationRequest;
import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingsResponse;
import com.groupfour.movietickets.entity.Booking;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BookingsMapper {

    @Mapping(target = "expiresAt", expression = "java(java.time.LocalDateTime.now(java.time.ZoneId.of(\"Asia/Ho_Chi_Minh\")).plusMinutes(10))")
    @Mapping(target = "bookingDate", expression = "java(java.time.LocalDate.now())")
    Booking toBooking(BookingCreationRequest request);


    BookingsResponse toBookingResponse(Booking booking);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);
}
