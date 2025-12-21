package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.CinemaCreationRequest;
import com.moviebooking.movie_service.dto.request.CinemaUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.CinemaResponse;
import com.moviebooking.movie_service.service.CinemaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cinemas")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CinemaController {
    CinemaService cinemaService;

    @PostMapping
    ApiResponse<CinemaResponse> createCinema(@RequestBody CinemaCreationRequest request){
        return ApiResponse.<CinemaResponse>builder()
                .result(cinemaService.createCinema(request)).build();
    }

    @GetMapping
    ApiResponse<List<CinemaResponse>> getCinemas(){
        return ApiResponse.<List<CinemaResponse>>builder()
                .result(cinemaService.getCinemas()).build();
    }

    @GetMapping("/{cinemaId}")
    ApiResponse<CinemaResponse> getCinema(@PathVariable("cinemaId") Long id){
        return ApiResponse.<CinemaResponse>builder().result(cinemaService.getCinemaById(id)).build();
    }
    @DeleteMapping("/{cinemaId}")
    ApiResponse<String> deleteCinema(@PathVariable("cinemaId") Long id){
        cinemaService.deleteCinema(id);
        return ApiResponse.<String>builder().result("Cinema has been deleted.").build();
    }
    @PutMapping("/{cinemaId}")
    ApiResponse<CinemaResponse> updateCinema(@PathVariable("cinemaId") Long id, @RequestBody CinemaUpdateRequest request){
        return ApiResponse.<CinemaResponse>builder().result(cinemaService.updateCinema(id, request)).build();
    }
    @PatchMapping("/{cinemaId}")
    ApiResponse<CinemaResponse> patchCinema(@PathVariable("cinemaId") Long id, @RequestBody CinemaUpdateRequest request){
        return ApiResponse.<CinemaResponse>builder().result(cinemaService.updateCinema(id, request)).build();
    }
}
