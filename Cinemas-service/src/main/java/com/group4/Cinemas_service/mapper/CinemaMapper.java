package com.group4.Cinemas_service.mapper;

import com.group4.Cinemas_service.dto.request.CinemaCreationRequest;
import com.group4.Cinemas_service.dto.response.CinemaResponse;
import com.group4.Cinemas_service.entity.Cinema;
import org.springframework.stereotype.Component;

@Component
public class CinemaMapper {

    public CinemaResponse toResponse(Cinema cinema) {
        if (cinema == null) return null;
        CinemaResponse dto = new CinemaResponse();
        dto.setId(cinema.getId());
        dto.setName(cinema.getName());
        dto.setAddress(cinema.getAddress());
        return dto;
    }

    public Cinema toEntity(CinemaCreationRequest request) {
        if (request == null) return null;
        Cinema cinema = new Cinema();
        cinema.setName(request.getName());
        cinema.setAddress(request.getAddress());
        return cinema;
    }
}
