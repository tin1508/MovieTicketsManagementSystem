package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.BookingCreationRequest;
import com.moviebooking.movie_service.dto.request.BookingUpdateRequest;
import com.moviebooking.movie_service.dto.response.BookingsResponse;

import com.moviebooking.movie_service.dto.response.TicketResponse;
import com.moviebooking.movie_service.entity.Booking;
import com.moviebooking.movie_service.entity.BookingDetail;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ShowtimesMapper.class})
public interface BookingsMapper {
    Booking toBooking(BookingCreationRequest request);

    @Mapping(target = "tickets", source = "bookingDetails")
    @Mapping(source = "user.username", target = "username")
    BookingsResponse toBookingResponse(Booking booking);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBooking(@MappingTarget Booking booking, BookingUpdateRequest request);

    @Mapping(target = "ticketCode", source = "ticketCode")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "seatName", source = "showtimeSeat.seat.seatName")
    @Mapping(target = "roomName", source = "showtimeSeat.showtimes.room.name")
    @Mapping(target = "movieTitle", source = "showtimeSeat.showtimes.movie.title")
    @Mapping(target = "startTime", source = "showtimeSeat.showtimes.startTime")
    @Mapping(target = "showtimesDate", source = "showtimeSeat.showtimes.showtimesDate")
    TicketResponse toTicketResponse(BookingDetail bookingDetail);

}
