package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.BookingCreationRequest;
import com.moviebooking.movie_service.dto.request.BookingUpdateRequest;
import com.moviebooking.movie_service.dto.response.BookingsResponse;
import com.moviebooking.movie_service.entity.Booking;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ShowtimesMapper.class, BookingDetailMapper.class})
public interface BookingsMapper {
    Booking toBooking(BookingCreationRequest request);


    BookingsResponse toBookingResponse(Booking booking);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);
}

