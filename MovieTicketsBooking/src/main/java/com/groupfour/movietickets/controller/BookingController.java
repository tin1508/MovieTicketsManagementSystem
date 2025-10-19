package com.groupfour.movietickets.controller;


import com.groupfour.movietickets.dto.request.ApiResponse;
import com.groupfour.movietickets.dto.request.BookingCreationRequest;
import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
import com.groupfour.movietickets.dto.response.BookingsResponse;
import com.groupfour.movietickets.entity.Booking;
import com.groupfour.movietickets.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {

    BookingService bookingService;

    @PostMapping
    ApiResponse<Booking> createBooking(@RequestBody BookingCreationRequest request){
        ApiResponse<Booking> apiResponse = new ApiResponse<>();
        apiResponse.setResult(bookingService.createBookings(request));
        return apiResponse;
    }

    @GetMapping
    List<Booking> getBookings(){
        return bookingService.getBookings();
    }

    @GetMapping("/{bookingId}")
    BookingsResponse getBooking(@PathVariable("bookingId") String id){
        return bookingService.getBookingById(id);
    }

    @PutMapping("/{bookingId}")
    BookingsResponse updateBooking(@PathVariable("bookingId") String id, @RequestBody BookingUpdateRequest request){
        return bookingService.updateBooking(id, request);
    }

    //partial update for booking
    @PatchMapping("/{bookingId}")
    BookingsResponse patchBooking(@PathVariable("bookingId") String id, @RequestBody BookingUpdateRequest request){
        return bookingService.updateBooking(id, request);
    }

    @DeleteMapping("/{bookingId}")
    String deleteBooking(@PathVariable("bookingId") String id){
        bookingService.deleteBooking(id);
        return "Booking has been deleted!!!";
    }
}
