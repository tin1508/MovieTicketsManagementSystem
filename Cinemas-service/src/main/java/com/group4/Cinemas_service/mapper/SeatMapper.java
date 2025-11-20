package com.group4.Cinemas_service.mapper;


import com.group4.Cinemas_service.dto.response.SeatResponse;
import com.group4.Cinemas_service.entity.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public SeatResponse toResponse(Seat seat) {
        SeatResponse dto = new SeatResponse();
        dto.setId(seat.getId());
        dto.setRowName(seat.getRowName());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setSeatCode(seat.getRowName() + seat.getSeatNumber()); // A1, B5, ...
        dto.setRoomId(seat.getRoom().getId());
        return dto;
    }
}

