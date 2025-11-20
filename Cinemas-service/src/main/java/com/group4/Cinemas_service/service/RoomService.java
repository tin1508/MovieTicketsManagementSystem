package com.group4.Cinemas_service.service;

import com.group4.Cinemas_service.dto.request.RoomCreationRequest;
import com.group4.Cinemas_service.dto.response.RoomResponse;
import com.group4.Cinemas_service.entity.Cinema;
import com.group4.Cinemas_service.entity.Room;
import com.group4.Cinemas_service.entity.Seat;
import com.group4.Cinemas_service.mapper.RoomMapper;
import com.group4.Cinemas_service.repository.CinemaRepository;
import com.group4.Cinemas_service.repository.RoomRepository;
import com.group4.Cinemas_service.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;
    private final RoomMapper roomMapper;

    public RoomResponse create(RoomCreationRequest request) {

        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new RuntimeException("Cinema not found"));

        Room room = new Room();
        room.setName(request.getName());
        room.setTotalRows(request.getTotalRows());
        room.setSeatsPerRow(request.getSeatsPerRow());
        room.setCinema(cinema);

        roomRepository.save(room);

        // === Generate seats ===
        for (int row = 0; row < request.getTotalRows(); row++) {
            String rowName = String.valueOf((char)('A' + row)); // A,B,C...

            for (int number = 1; number <= request.getSeatsPerRow(); number++) {
                Seat seat = new Seat();
                seat.setRowName(rowName);
                seat.setSeatNumber(number);
                seat.setRoom(room);
                seatRepository.save(seat);
            }
        }

        return roomMapper.toResponse(room);
    }
}


