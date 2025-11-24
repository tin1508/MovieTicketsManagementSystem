//package com.moviebooking.movie_service.controller;
//
//
//import com.moviebooking.movie_service.dto.response.ApiResponse;
//import com.groupfour.movietickets.dto.request.BookingCreationRequest;
//import com.groupfour.movietickets.dto.request.BookingUpdateRequest;
//import com.groupfour.movietickets.dto.response.BookingsResponse;
//import com.groupfour.movietickets.service.BookingService;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/bookings")
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class BookingController {
//
//    BookingService bookingService;
//
//    @PostMapping
//    ApiResponse<BookingsResponse> createBooking(@RequestBody BookingCreationRequest request){
//        return ApiResponse.<BookingsResponse>builder()
//                .result(bookingService.createBookings(request)).build();
//    }
//    @PostMapping("/confirm/{bookingId}")
//    ApiResponse<BookingsResponse> confirmBooking(@PathVariable("bookingId") String bookingId){
//        return ApiResponse.<BookingsResponse>builder().result(bookingService.confirmBooking(bookingId)).build();
//    }
//
//    @GetMapping
//    ApiResponse<List<BookingsResponse>> getBookings(){
//        return ApiResponse.<List<BookingsResponse>>builder()
//                .result(bookingService.getBookings()).build();
//    }
//
//    @GetMapping("/{bookingId}")
//    ApiResponse<BookingsResponse> getBooking(@PathVariable("bookingId") String id){
//        return ApiResponse.<BookingsResponse>builder().result(bookingService.getBookingById(id)).build();
//    }
//
//    @PutMapping("/{bookingId}")
//    ApiResponse<BookingsResponse> updateBooking(@PathVariable("bookingId") String id, @RequestBody BookingUpdateRequest request){
//        return ApiResponse.<BookingsResponse>builder().result(bookingService.updateBooking(id, request)).build();
//    }
//
//    //partial update for booking
//    @PatchMapping("/{bookingId}")
//    ApiResponse<BookingsResponse> patchBooking(@PathVariable("bookingId") String id, @RequestBody BookingUpdateRequest request){
//        return ApiResponse.<BookingsResponse>builder().result(bookingService.updateBooking(id, request)).build();
//    }
//
//    @DeleteMapping("/{bookingId}")
//    ApiResponse<String> deleteBooking(@PathVariable("bookingId") String id){
//        bookingService.deleteBooking(id);
//        return ApiResponse.<String>builder().result("Booking has been deleted.").build();
//    }
//}
