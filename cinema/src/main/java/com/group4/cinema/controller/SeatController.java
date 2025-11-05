package com.group4.cinema.controller;

import com.group4.cinema.dto.request.SeatCreationRequest;
import com.group4.cinema.dto.request.SeatUpdateRequest;
import com.group4.cinema.dto.response.SeatResponse;
import com.group4.cinema.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
public class SeatController {
    private final SeatService seatService;

    @PostMapping
    public ResponseEntity<SeatResponse> createSeat(@RequestBody SeatCreationRequest request) {
        return ResponseEntity.ok(seatService.createSeat(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeatResponse> updateSeat(@PathVariable String id, @RequestBody SeatUpdateRequest request) {
        return ResponseEntity.ok(seatService.updateSeat(id, request));
    }

    @GetMapping
    public ResponseEntity<List<SeatResponse>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<SeatResponse>> getSeatsByRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(seatService.getSeatsByRoom(roomId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeat(@PathVariable String id) {
        seatService.deleteSeat(id);
        return ResponseEntity.ok("Seat deleted successfully");
    }
}
