package com.group4.cinema.controller;

import com.group4.cinema.dto.request.CinemaCreationRequest;
import com.group4.cinema.dto.request.CinemaUpdateRequest;
import com.group4.cinema.entity.Cinema;
import com.group4.cinema.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cinemas")
public class CinemaController {
    @Autowired
    private CinemaService cinemaService;

    @PostMapping
    Cinema createCinema(@RequestBody CinemaCreationRequest request){
        return cinemaService.createCinema(request);
    }

    @GetMapping
    List<Cinema> getCinemas(){
        return cinemaService.getCinemas();
    }

    @GetMapping("/{cinemaId}")
    Cinema getCinemaById(@PathVariable("cinemaId") String cinemaId){
        return cinemaService.getCinemaById(cinemaId);
    }

    @PutMapping("/{cinemaId}")
    Cinema updateCinema(@PathVariable String cinemaId, @RequestBody CinemaUpdateRequest request){
        return cinemaService.updateCinema(cinemaId, request);
    }

    @DeleteMapping("/{cinemaId}")
    String deleteCinema(@PathVariable String cinemaId){
        cinemaService.deleteCinema(cinemaId);
        return "Cinema has been deleted";
    }

    @PatchMapping("/{cinemaId}")
    Cinema patchCinema(@PathVariable String cinemaId, @RequestBody CinemaUpdateRequest request){
        return cinemaService.patchCinema(cinemaId, request);
    }
}
