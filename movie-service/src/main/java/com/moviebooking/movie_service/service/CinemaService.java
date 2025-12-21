package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.CinemaCreationRequest;
import com.moviebooking.movie_service.dto.request.CinemaUpdateRequest;
import com.moviebooking.movie_service.dto.response.CinemaResponse;
import com.moviebooking.movie_service.entity.Cinema;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.CinemaMapper;
import com.moviebooking.movie_service.repository.CinemaRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CinemaService {
    CinemaRepository cinemaRepository;
    CinemaMapper cinemaMapper;

    public CinemaResponse createCinema(CinemaCreationRequest request){
        Cinema cinema = cinemaMapper.toCinema(request);
        return cinemaMapper.toCinemaResponse(cinemaRepository.save(cinema));
    }

    public CinemaResponse updateCinema(Long id, CinemaUpdateRequest request){
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOTFOUND));
        cinemaMapper.updateCinema(cinema, request);
        return cinemaMapper.toCinemaResponse(cinemaRepository.save(cinema));
    }

    public CinemaResponse getCinemaById(Long id){
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOTFOUND));
        return cinemaMapper.toCinemaResponse(cinema);
    }
    public void deleteCinema(Long id){
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOTFOUND));
        cinemaRepository.deleteById(cinema.getId());
    }
    public List<CinemaResponse> getCinemas(){
        return cinemaRepository.findAll().stream().map(cinemaMapper::toCinemaResponse).toList();
    }

}
