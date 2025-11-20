package com.group4.Cinemas_service.controller;


import com.group4.Cinemas_service.dto.request.CinemaCreationRequest;
import com.group4.Cinemas_service.dto.response.CinemaResponse;
import com.group4.Cinemas_service.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cinemas")
@RequiredArgsConstructor
public class CinemaController {

    private final CinemaService cinemaService;

    @PostMapping
    public CinemaResponse create(@RequestBody CinemaCreationRequest request) {
        return cinemaService.create(request);
    }

    @GetMapping
    public List<CinemaResponse> getAll() {
        return cinemaService.getAll();
    }

    @GetMapping("/{id}")
    public CinemaResponse getById(@PathVariable Long id) {
        return cinemaService.getById(id);
    }
}

