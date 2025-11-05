package com.groupfour.movietickets.mapper;

import com.groupfour.movietickets.dto.request.BookingCreationRequest;
import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingsResponse;
import com.groupfour.movietickets.entity.Booking;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (Oracle Corporation)"
)
@Component
public class BookingsMapperImpl implements BookingsMapper {

    @Override
    public Booking toBooking(BookingCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Booking booking = new Booking();

        booking.setTicketQuantity( request.getTicketQuantity() );
        booking.setTotalPrice( request.getTotalPrice() );
        booking.setStatus( request.getStatus() );

        booking.setExpiresAt( java.time.LocalDateTime.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh")).plusMinutes(10) );
        booking.setBookingDate( java.time.LocalDate.now() );

        return booking;
    }

    @Override
    public BookingsResponse toBookingResponse(Booking booking) {
        if ( booking == null ) {
            return null;
        }

        BookingsResponse.BookingsResponseBuilder bookingsResponse = BookingsResponse.builder();

        bookingsResponse.bookingCode( booking.getBookingCode() );
        bookingsResponse.bookingDate( booking.getBookingDate() );
        bookingsResponse.ticketQuantity( booking.getTicketQuantity() );
        bookingsResponse.totalPrice( booking.getTotalPrice() );
        bookingsResponse.expiresAt( booking.getExpiresAt() );
        bookingsResponse.status( booking.getStatus() );

        return bookingsResponse.build();
    }

    @Override
    public void updateBooking(Booking booking, BookingUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getTicketQuantity() != null ) {
            booking.setTicketQuantity( request.getTicketQuantity() );
        }
        booking.setTotalPrice( request.getTotalPrice() );
        if ( request.getStatus() != null ) {
            booking.setStatus( request.getStatus() );
        }
    }
}
