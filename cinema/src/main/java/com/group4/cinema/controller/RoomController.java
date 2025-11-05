package com.group4.cinema.controller;

import com.group4.cinema.dto.request.RoomCreationRequest;
import com.group4.cinema.dto.request.RoomUpdateRequest;
import com.group4.cinema.dto.response.RoomResponse;
import com.group4.cinema.entity.Room;
import com.group4.cinema.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom (@RequestBody RoomCreationRequest request){
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable String roomId,
            @RequestBody RoomUpdateRequest request
    ) {
        return ResponseEntity.ok(roomService.updateRoom(roomId, request));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable String id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<List<Room>> getRoomsByCinema(@PathVariable String cinemaId) {
        return ResponseEntity.ok(roomService.getRoomsByCinema(cinemaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable String id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }
}
