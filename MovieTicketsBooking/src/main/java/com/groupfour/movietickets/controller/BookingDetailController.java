package com.groupfour.movietickets.controller;

import com.groupfour.movietickets.dto.request.*;
import com.groupfour.movietickets.dto.response.BookingDetailResponse;
import com.groupfour.movietickets.service.BookingDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookingDetail")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingDetailController {

    BookingDetailService bookingDetailService;

    @PostMapping
    ApiResponse<BookingDetailResponse> createBooking(@RequestBody BookingDetailCreationRequest request){
        return ApiResponse.<BookingDetailResponse>builder()
                .result(bookingDetailService.createBookingDetail(request)).build();
    }

    @GetMapping
    ApiResponse<List<BookingDetailResponse>> getBookings(){
        return ApiResponse.<List<BookingDetailResponse>>builder()
                .result(bookingDetailService.getBookingDetails()).build();
    }

    @GetMapping("/{bookingDetailId}")
    ApiResponse<BookingDetailResponse> getBooking(@PathVariable("bookingDetailId") String id){
        return ApiResponse.<BookingDetailResponse>builder().result(bookingDetailService.getBookingDetailById(id)).build();
    }

    @PutMapping("/{bookingDetailId}")
    ApiResponse<BookingDetailResponse> updateBooking(@PathVariable("bookingDetailId") String id, @RequestBody BookingDetailUpdateRequest request){
        return ApiResponse.<BookingDetailResponse>builder().result(bookingDetailService.updateBookingDetail(id, request)).build();
    }

    //partial update for booking
    @PatchMapping("/{bookingDetailId}")
    ApiResponse<BookingDetailResponse> patchBooking(@PathVariable("bookingDetailId") String id, @RequestBody BookingDetailUpdateRequest request){
        return ApiResponse.<BookingDetailResponse>builder().result(bookingDetailService.updateBookingDetail(id, request)).build();
    }

    @DeleteMapping("/{bookingDetailId}")
    ApiResponse<String> deleteBooking(@PathVariable("bookingDetailId") String id){
        bookingDetailService.deleteBookingDetail(id);
        return ApiResponse.<String>builder().result("Booking has been deleted.").build();
    }
}