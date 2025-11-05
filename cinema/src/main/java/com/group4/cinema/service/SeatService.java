package com.group4.cinema.service;

import com.group4.cinema.dto.request.SeatCreationRequest;
import com.group4.cinema.dto.request.SeatUpdateRequest;
import com.group4.cinema.dto.response.SeatResponse;
import com.group4.cinema.entity.Room;
import com.group4.cinema.entity.Seat;
import com.group4.cinema.repository.RoomRepository;
import com.group4.cinema.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;

    public SeatResponse createSeat(SeatCreationRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Seat seat = Seat.builder()
                .room(room)
                .row(request.getRow())
                .seatNo(request.getSeatNo())
                .seatType(request.getSeatType())
                .build();

        Seat saved = seatRepository.save(seat);
        return mapToResponse(saved);
    }

    public SeatResponse updateSeat(String id, SeatUpdateRequest request) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        seat.setRow(request.getRow());
        seat.setSeatNo(request.getSeatNo());
        seat.setSeatType(request.getSeatType());

        Seat updated = seatRepository.save(seat);
        return mapToResponse(updated);
    }

    public List<SeatResponse> getAllSeats() {
        return seatRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<SeatResponse> getSeatsByRoom(String roomId) {
        return seatRepository.findByRoomId(roomId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteSeat(String id) {
        seatRepository.deleteById(id);
    }

    private SeatResponse mapToResponse(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getRoom().getId(),
                seat.getRow(),
                seat.getSeatNo(),
                seat.getSeatType()
        );
    }

}




