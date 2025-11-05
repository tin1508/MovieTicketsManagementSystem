package com.groupfour.movietickets.service;

import com.groupfour.movietickets.Exception.AppException;
import com.groupfour.movietickets.Exception.ErrorCode;
import com.groupfour.movietickets.dto.request.BookingCreationRequest;
import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingsResponse;
import com.groupfour.movietickets.entity.Booking;
import com.groupfour.movietickets.enums.BookingStatus;
import com.groupfour.movietickets.mapper.BookingsMapper;
import com.groupfour.movietickets.repository.BookingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {

    BookingRepository bookingRepository;
    BookingsMapper bookingsMapper;

    public BookingsResponse createBookings(BookingCreationRequest request){

        Booking bookings = bookingsMapper.toBooking(request);

        //create unique booking code
        String uniqueBookingCode;
        do{
            //create a code with exact 8 characters
            uniqueBookingCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        }while(bookingRepository.existsByBookingCode(uniqueBookingCode));

        bookings.setBookingCode(uniqueBookingCode);

        //set bookingDate as soon as having finished payment
        if(request.getStatus() == BookingStatus.CONFIRMED) bookings.setBookingDate(LocalDate.now());
        else bookings.setBookingDate(null);

        //set default value for status
        if(request.getStatus() == null)  bookings.setStatus(BookingStatus.PENDING);

        return bookingsMapper.toBookingResponse(bookingRepository.save(bookings));
    }

    public BookingsResponse updateBooking(String id, BookingUpdateRequest request){
        Booking bookings = bookingRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND));
        if(request.getStatus() == BookingStatus.CONFIRMED) bookings.setBookingDate(LocalDate.now());
        bookingsMapper.updateBooking(bookings, request);
        return bookingsMapper.toBookingResponse(bookingRepository.save(bookings));
    }


    public void deleteBooking(String id){
        bookingRepository.deleteById(id);
    }

    public List<BookingsResponse> getBookings(){
        return bookingRepository.findAll().stream().map(bookingsMapper::toBookingResponse).toList();
    }
    public BookingsResponse getBookingById(String id) {
        return bookingsMapper.toBookingResponse(bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOTFOUND)));
    }
}
