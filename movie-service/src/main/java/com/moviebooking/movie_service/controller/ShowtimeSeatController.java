package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.SeatActionRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.ShowtimeSeatResponse;
import com.moviebooking.movie_service.security.SecurityUtils;
import com.moviebooking.movie_service.service.ShowtimeSeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/showtimeSeat")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeSeatController {
    ShowtimeSeatService showtimeSeatService;

    @GetMapping("/{showtimeId}")
    public ApiResponse<List<ShowtimeSeatResponse>> getSeatsByShowtime(
            @PathVariable String showtimeId) {
        return ApiResponse.<List<ShowtimeSeatResponse>>builder()
                .result(showtimeSeatService.getSeatsByShowtime(showtimeId))
                .build();
    }
    @PostMapping("/{showtimeId}/hold")
    public ApiResponse<Void> holdSeats(@PathVariable String showtimeId, @RequestBody SeatActionRequest request, @RequestHeader("X-GUEST_ID") String guestId) {
        String userId = SecurityUtils.getUserIdOrNull();
        String holderId = (userId != null) ? userId : guestId;
        showtimeSeatService.holdSeats(showtimeId, request.getSeatIds(), holderId);
        return ApiResponse.<Void>builder().message("Seats are held successfully").build();
    }
    @PostMapping("/{showtimeId}/release")
    public ApiResponse<Void> releaseSeats(@PathVariable String showtimeId, @RequestBody SeatActionRequest request, @RequestHeader("X-GUEST_ID") String guestId) {
        String userId = SecurityUtils.getUserIdOrNull();
        String holderId =  (userId != null) ? userId : guestId;

        showtimeSeatService.releaseSeats(showtimeId, request.getSeatIds(), holderId);
        return ApiResponse.<Void>builder().message("Seats are released successfully").build();
    }
    @GetMapping("/get_all")
    public ApiResponse<List<ShowtimeSeatResponse>> getShowtimeSeats(){
        return ApiResponse.<List<ShowtimeSeatResponse>>builder().result(showtimeSeatService.getShowtimeSeats()).build();
    }
}
