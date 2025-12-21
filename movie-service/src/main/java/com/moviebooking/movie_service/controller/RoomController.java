package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.RoomCreationRequest;
import com.moviebooking.movie_service.dto.request.RoomUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.RoomResponse;
import com.moviebooking.movie_service.entity.Room;
import com.moviebooking.movie_service.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {
    RoomService roomService;

    @PostMapping
    ApiResponse<RoomResponse> createRoom(@RequestBody RoomCreationRequest request){
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.createRoom(request)).build();
    }
    @GetMapping
    ApiResponse<List<RoomResponse>> getAllRooms(){
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.getAllRooms()).build();
    }
    @GetMapping("/{roomId}")
    ApiResponse<RoomResponse> getRoom(@PathVariable("roomId") Long roomId){
        return ApiResponse.<RoomResponse>builder().result(roomService.getRoom(roomId)).build();
    }
    @PutMapping("/{roomId}")
    ApiResponse<RoomResponse> updateRoom(@PathVariable("roomId") Long roomId, @RequestBody RoomUpdateRequest request){
        return ApiResponse.<RoomResponse>builder().result(roomService.updateRoom(roomId, request)).build();
    }
    @PatchMapping("/{roomId}")
    ApiResponse<RoomResponse> patchRoom(@PathVariable("roomId") Long roomId, @RequestBody RoomUpdateRequest request){
        return ApiResponse.<RoomResponse>builder().result(roomService.updateRoom(roomId, request)).build();
    }
    @DeleteMapping("/{roomId}")
    ApiResponse<String> deleteRoom(@PathVariable("roomId") Long roomId){
        roomService.deleteRoom(roomId);
        return ApiResponse.<String>builder().result("Room has been deleted!").build();
    }
}
