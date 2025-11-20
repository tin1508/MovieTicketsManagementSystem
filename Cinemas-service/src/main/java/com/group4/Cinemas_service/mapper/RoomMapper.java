package com.group4.Cinemas_service.mapper;

import com.group4.Cinemas_service.dto.request.RoomCreationRequest;
import com.group4.Cinemas_service.entity.Cinema;
import com.group4.Cinemas_service.dto.response.RoomResponse;
import com.group4.Cinemas_service.entity.Cinema;
import com.group4.Cinemas_service.entity.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomResponse toResponse(Room room) {
        if (room == null) return null;
        RoomResponse dto = new RoomResponse();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setTotalRows(room.getTotalRows());
        dto.setSeatsPerRow(room.getSeatsPerRow());
        dto.setCinemaId(room.getCinema() != null ? room.getCinema().getId() : null);
        return dto;
    }

    public Room toEntity(RoomCreationRequest request, Cinema cinema) {
        if (request == null) return null;
        Room room = new Room();
        room.setName(request.getName());
        room.setTotalRows(request.getTotalRows());
        room.setSeatsPerRow(request.getSeatsPerRow());
        room.setCinema(cinema);
        return room;
    }
}

