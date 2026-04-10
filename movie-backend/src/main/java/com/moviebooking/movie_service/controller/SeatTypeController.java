package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.SeatTypeCreationRequest;
import com.moviebooking.movie_service.dto.request.SeatTypeUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.SeatTypeResponse;
import com.moviebooking.movie_service.service.SeatTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seat_types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatTypeController {
    SeatTypeService seatTypeService;

    @PostMapping
    ApiResponse<SeatTypeResponse> creatSeatType(@RequestBody SeatTypeCreationRequest request){
        return ApiResponse.<SeatTypeResponse>builder()
                .result(seatTypeService.createSeatType(request)).build();
    }
    @GetMapping("/{id}")
    ApiResponse<SeatTypeResponse> getSeatTypeBId(@PathVariable("id") Long id){
        return ApiResponse.<SeatTypeResponse>builder().result(seatTypeService.getSeatTypeById(id)).build();
    }
    @GetMapping
    ApiResponse<List<SeatTypeResponse>> getAllSeatTypes(){
        return ApiResponse.<List<SeatTypeResponse>>builder()
                .result(seatTypeService.getSeatTypes()).build();
    }
    @DeleteMapping("/{id}")
    ApiResponse<String> deleteSeatType(@PathVariable("id") Long id){
        seatTypeService.deleteSeatType(id);
        return ApiResponse.<String>builder().result("Seat type has been deleted.").build();
    }
    @PutMapping("/{id}")
    ApiResponse<SeatTypeResponse> updateSeatType(@PathVariable("id") Long id, @RequestBody SeatTypeUpdateRequest request){
        return ApiResponse.<SeatTypeResponse>builder().result(seatTypeService.updateSeatType(id, request)).build();
    }
    @PatchMapping("/{id}")
    ApiResponse<SeatTypeResponse> patchSeatType(@PathVariable("id") Long id, @RequestBody SeatTypeUpdateRequest request){
        return ApiResponse.<SeatTypeResponse>builder().result(seatTypeService.updateSeatType(id, request)).build();
    }
}