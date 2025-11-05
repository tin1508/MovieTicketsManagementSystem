package com.groupfour.movietickets.controller;

import com.groupfour.movietickets.dto.request.*;
import com.groupfour.movietickets.dto.response.ShowtimeSeatResponse;
import com.groupfour.movietickets.service.ShowtimeSeatService;
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

    @PostMapping
    ApiResponse<ShowtimeSeatResponse> createShowtimeSeat(@RequestBody ShowtimeSeatCreationRequest request){
        return ApiResponse.<ShowtimeSeatResponse>builder()
                .result(showtimeSeatService.createShowtimeSeat(request)).build();
    }
    @GetMapping
    ApiResponse<List<ShowtimeSeatResponse>> getShowtimeSeats(){
        return ApiResponse.<List<ShowtimeSeatResponse>>builder()
                .result(showtimeSeatService.getShowtimeSeats()).build();
    }
    @GetMapping("/{showtimeSeatId}")
    ApiResponse<ShowtimeSeatResponse> getShowtimeSeat(@PathVariable("showtimeSeatId") String id){
        return ApiResponse.<ShowtimeSeatResponse>builder().result(showtimeSeatService.getShowtimeSeatById(id)).build();
    }
    @PutMapping("/{showtimeSeatId}")
    ApiResponse<ShowtimeSeatResponse> updateShowtimeSeat(@PathVariable("showtimeSeatId") String id, @RequestBody ShowtimeSeatUpdateRequest request){
        return ApiResponse.<ShowtimeSeatResponse>builder().result(showtimeSeatService.updateShowtimeSeat(id, request)).build();
    }

    //partial update for booking
    @PatchMapping("/{showtimeSeatId}")
    ApiResponse<ShowtimeSeatResponse> patchShowtimeSeat(@PathVariable("showtimeSeatId") String id, @RequestBody ShowtimeSeatUpdateRequest request){
        return ApiResponse.<ShowtimeSeatResponse>builder().result(showtimeSeatService.updateShowtimeSeat(id, request)).build();
    }

    @DeleteMapping("/{showtimeSeatId}")
    ApiResponse<String> deleteBooking(@PathVariable("showtimeSeatId") String id){
        showtimeSeatService.deleteShowtimeSeat(id);
        return ApiResponse.<String>builder().result("Showtime seat has been deleted.").build();
    }
}
