package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.ShowtimesCreationRequest;
import com.moviebooking.movie_service.dto.request.ShowtimesUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.ShowtimesResponse;
import com.moviebooking.movie_service.service.ShowtimesService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/showtimes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimesController {
    ShowtimesService showtimesService;
    @PostMapping
    ApiResponse<ShowtimesResponse> createShowtime(@RequestBody ShowtimesCreationRequest request){
        return ApiResponse.<ShowtimesResponse>builder().result(showtimesService.createShowtimes(request)).build();
    }
    @GetMapping
    ApiResponse<List<ShowtimesResponse>> getShowtimes(){
        return ApiResponse.<List<ShowtimesResponse>>builder().result(showtimesService.getShowtimes()).build();
    }
    @GetMapping("/{showtimesId}")
    ApiResponse<ShowtimesResponse> getShowtime(@PathVariable("showtimesId") String showtimesId){
        return ApiResponse.<ShowtimesResponse>builder().result(showtimesService.getShowtimesById(showtimesId)).build();
    }
    @PutMapping("/{showtimesId}")
    ApiResponse<ShowtimesResponse> updateShowtimes(@PathVariable("showtimesId") String id, @RequestBody ShowtimesUpdateRequest request){
        return ApiResponse.<ShowtimesResponse>builder().result(showtimesService.updateShowtimes(id, request)).build();
    }
    @PatchMapping("/{showtimesId}")
    ApiResponse<ShowtimesResponse> patchShowtimes(@PathVariable("showtimesId") String id, @RequestBody ShowtimesUpdateRequest request){
        return ApiResponse.<ShowtimesResponse>builder().result(showtimesService.updateShowtimes(id, request)).build();
    }
    @DeleteMapping("/{showtimesId}")
    ApiResponse<String> deleteShowtime(@PathVariable("showtimesId") String id){
        showtimesService.deleteShowtimes(id);
        return ApiResponse.<String>builder().result("Showtime has been deleted!").build();
    }
    @GetMapping("/dates/{movieId}")
    public ApiResponse<List<LocalDate>> getDatesByMovie(@PathVariable String movieId) {
        return ApiResponse.<List<LocalDate>>builder()
                .result(showtimesService.getDatesByMovie(movieId))
                .build();
    }
    @GetMapping("/detail/{movieId}")
    public ApiResponse<List<ShowtimesResponse>> getShowtimesByMovieAndDate(
            @PathVariable String movieId,
            @RequestParam("date") LocalDate date) { // Spring tự động chuyển "YYYY-MM-DD" thành LocalDate
        return ApiResponse.<List<ShowtimesResponse>>builder()
                .result(showtimesService.getShowtimesByMovieAnDates(movieId, date))
                .build();
    }
}