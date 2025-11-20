package com.group4.Cinemas_service.service;


import com.group4.Cinemas_service.dto.request.CinemaCreationRequest;
import com.group4.Cinemas_service.dto.response.CinemaResponse;
import com.group4.Cinemas_service.entity.Cinema;
import com.group4.Cinemas_service.mapper.CinemaMapper;
import com.group4.Cinemas_service.repository.CinemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CinemaService {

    private final CinemaRepository cinemaRepository;
    private final CinemaMapper cinemaMapper;

    public CinemaResponse create(CinemaCreationRequest request) {
        Cinema cinema = cinemaMapper.toEntity(request);
        cinemaRepository.save(cinema);
        return cinemaMapper.toResponse(cinema);
    }

    public List<CinemaResponse> getAll() {
        return cinemaRepository.findAll()
                .stream()
                .map(cinemaMapper::toResponse)
                .toList();
    }

    public CinemaResponse getById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found"));
        return cinemaMapper.toResponse(cinema);
    }
}

