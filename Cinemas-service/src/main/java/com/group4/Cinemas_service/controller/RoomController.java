package com.group4.Cinemas_service.controller;

import com.group4.Cinemas_service.dto.request.RoomCreationRequest;
import com.group4.Cinemas_service.dto.response.RoomResponse;
import com.group4.Cinemas_service.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public RoomResponse create(@RequestBody RoomCreationRequest request) {
        return roomService.create(request);
    }

    @GetMapping
    public List<RoomResponse> getAll() {
        return roomService.getAll();
    }

    @GetMapping("/{id}")
    public RoomResponse getById(@PathVariable Long id) {
        return roomService.getById(id);
    }
}
