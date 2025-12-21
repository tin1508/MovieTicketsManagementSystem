package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.SeatUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.SeatResponse;
import com.moviebooking.movie_service.service.SeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatController {
    SeatService seatService;

    @GetMapping("/room/{roomId}")
    ApiResponse<List<SeatResponse>> getSeatsByRoomId(@PathVariable("roomId") Long id){
        return ApiResponse.<List<SeatResponse>>builder().result(seatService.getSeats(id)).build();
    }
    @GetMapping("/{id}")
    ApiResponse<SeatResponse> getSeat(@PathVariable("id") Long id) {
        return ApiResponse.<SeatResponse>builder()
                .result(seatService.getSeatById(id))
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<SeatResponse> updateSeat(@PathVariable("id") Long id,
                                                @RequestBody SeatUpdateRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .result(seatService.updateSeat(id, request))
                .build();
    }
}
