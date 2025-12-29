package com.moviebooking.movie_service.controller;


import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.request.BookingCreationRequest;
import com.moviebooking.movie_service.dto.request.BookingUpdateRequest;
import com.moviebooking.movie_service.dto.response.BookingsResponse;
import com.moviebooking.movie_service.service.BookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {

    BookingService bookingService;

    @PostMapping
    ApiResponse<BookingsResponse> createBooking(@RequestBody BookingCreationRequest request){
        return ApiResponse.<BookingsResponse>builder()
                .result(bookingService.createBookings(request)).build();
    }
    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BookingsResponse> confirmBooking(@PathVariable String id){
        return ApiResponse.<BookingsResponse>builder().result(bookingService.confirmBooking(id)).build();
    }

    @PutMapping("/{id}/cancel-booking")
    public ApiResponse<BookingsResponse> cancelBooking(@PathVariable String id){
        return ApiResponse.<BookingsResponse>builder().result(bookingService.cancelBooking(id)).build();
    }

    @GetMapping
    ApiResponse<List<BookingsResponse>> getBookings(){
        return ApiResponse.<List<BookingsResponse>>builder()
                .result(bookingService.getBookings()).build();
    }

    @GetMapping("/{bookingId}")
    ApiResponse<BookingsResponse> getBooking(@PathVariable("bookingId") String id){
        return ApiResponse.<BookingsResponse>builder().result(bookingService.getBookingById(id)).build();
    }

    @PutMapping("/{bookingId}")
    ApiResponse<BookingsResponse> updateBooking(@PathVariable("bookingId") String id, @RequestBody BookingUpdateRequest request){
        return ApiResponse.<BookingsResponse>builder().result(bookingService.updateBooking(id, request)).build();
    }

    //partial update for booking
    @PatchMapping("/{bookingId}")
    ApiResponse<BookingsResponse> patchBooking(@PathVariable("bookingId") String id, @RequestBody BookingUpdateRequest request){
        return ApiResponse.<BookingsResponse>builder().result(bookingService.updateBooking(id, request)).build();
    }

    @DeleteMapping("/{bookingId}")
    ApiResponse<String> deleteBooking(@PathVariable("bookingId") String id){
        bookingService.deleteBooking(id);
        return ApiResponse.<String>builder().result("Booking has been deleted.").build();
    }
}
