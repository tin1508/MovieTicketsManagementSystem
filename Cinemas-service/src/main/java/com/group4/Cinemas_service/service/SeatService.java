package com.group4.Cinemas_service.service;

import com.group4.Cinemas_service.dto.response.SeatResponse;
import com.group4.Cinemas_service.mapper.SeatMapper;
import com.group4.Cinemas_service.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final SeatMapper seatMapper;

    public List<SeatResponse> getSeatsByRoom(Long roomId) {
        return seatRepository.findByRoom_Id(roomId)
                .stream()
                .map(seatMapper::toResponse)
                .toList();
    }
}

