package com.group4.Cinemas_service.controller;

import com.group4.Cinemas_service.dto.response.SeatResponse;
import com.group4.Cinemas_service.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/room/{roomId}")
    public List<SeatResponse> getSeatsByRoom(@PathVariable Long roomId) {
        return seatService.getSeatsByRoom(roomId);
    }
}

