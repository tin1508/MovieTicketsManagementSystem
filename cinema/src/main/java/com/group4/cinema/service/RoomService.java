package com.group4.cinema.service;

import com.group4.cinema.dto.request.RoomCreationRequest;
import com.group4.cinema.dto.request.RoomUpdateRequest;
import com.group4.cinema.dto.response.RoomResponse;
import com.group4.cinema.entity.Cinema;
import com.group4.cinema.entity.Room;
import com.group4.cinema.repository.CinemaRepository;
import com.group4.cinema.repository.RoomRepository;
import com.group4.cinema.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;

    public RoomResponse createRoom(RoomCreationRequest request){
        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));

        Room room = Room.builder()
                .cinema(cinema)
                .name(request.getName())
                .totalSeats(request.getTotalSeats())
                .totalRows(request.getTotalRows())
                .seatsPerRow(request.getSeatsPerRow())
                .build();

        Room saved  = roomRepository.save(room);
        return mapToResponse(saved);
    }


    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<Room> getRoomsByCinema(String cinemaId) {
        return roomRepository.findByCinemaId(cinemaId);
    }

    public RoomResponse getRoomById(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToResponse(room);
    }

    public RoomResponse updateRoom(String id, RoomUpdateRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setName(request.getName());
        room.setTotalSeats(request.getTotalSeats());
        room.setTotalRows(request.getTotalRows());
        room.setSeatsPerRow(request.getSeatsPerRow());
        Room updated = roomRepository.save(room);
        return mapToResponse(updated);
    }


    public void deleteRoom(String id) {
        roomRepository.deleteById(id);
    }

    public RoomResponse mapToResponse(Room room) {
        return new RoomResponse(
               room.getId(),
               room.getName(),
               room.getTotalSeats(),
               room.getTotalRows(),
               room.getSeatsPerRow(),
               room.getCinema().getId(),
               room.getCinema().getCinemaName()
                );
    }

}
