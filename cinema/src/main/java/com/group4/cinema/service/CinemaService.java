package com.group4.cinema.service;

import com.group4.cinema.dto.request.CinemaCreationRequest;
import com.group4.cinema.dto.request.CinemaUpdateRequest;
import com.group4.cinema.entity.Cinema;
import com.group4.cinema.repository.CinemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaService {
    @Autowired
    private CinemaRepository cinemaRepository;

    public Cinema createCinema(CinemaCreationRequest request){
        Cinema cinema = new Cinema();

        cinema.setCinemaName(request.getCinemaName());
        cinema.setCinemaAddress(request.getCinemaAddress());

        return cinemaRepository.save(cinema);
    }

    public Cinema updateCinema(String cinemaId, CinemaUpdateRequest request){
        Cinema cinema = getCinemaById(cinemaId);

        cinema.setCinemaName(request.getCinemaName());
        cinema.setCinemaAddress(request.getCinemaAddress());

        return cinemaRepository.save(cinema);
    }

    public Cinema patchCinema(String cinemaId, CinemaUpdateRequest request){
        Cinema cinema = getCinemaById(cinemaId);

        if (request.getCinemaName() != null){
            cinema.setCinemaName(request.getCinemaName());
        }
        if (request.getCinemaAddress() != null){
            cinema.setCinemaAddress(request.getCinemaAddress());
        }

        return cinemaRepository.save(cinema);
    }

    public void deleteCinema(String cinemaId){
        cinemaRepository.deleteById(cinemaId);
    }

    public List<Cinema> getCinemas(){
        return cinemaRepository.findAll();
    }

    public Cinema getCinemaById(String cinemaId){
        return cinemaRepository.findById(cinemaId)
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
    }
}
