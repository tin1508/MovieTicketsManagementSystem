package com.group4.Cinemas_service.service;

import com.group4.Cinemas_service.dto.request.RoomCreationRequest;
import com.group4.Cinemas_service.dto.response.RoomResponse;
import com.group4.Cinemas_service.entity.Cinema;
import com.group4.Cinemas_service.entity.Room;
import com.group4.Cinemas_service.entity.Seat;
import com.group4.Cinemas_service.enums.SeatType;
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

        // Tạo ghế tự động
        for (int row = 0; row < request.getTotalRows(); row++) {
            String rowName = String.valueOf((char) ('A' + row));

            boolean isCoupleRow = (row == request.getTotalRows() - 1);

            double leftBound = request.getSeatsPerRow() * 0.3;
            double rightBound = request.getSeatsPerRow() * 0.7;

            double topBound = request.getTotalRows() * 0.3;
            double bottomBound = request.getTotalRows() * 0.7;

            for (int seatNum = 1; seatNum <= request.getSeatsPerRow(); seatNum++) {

                Seat seat = new Seat();
                seat.setRowName(rowName);
                seat.setSeatNumber(seatNum);

                if (isCoupleRow) {
                    seat.setSeatType(SeatType.COUPLE);
                } else {

                    boolean isVipHoriz = (seatNum > leftBound && seatNum < rightBound);
                    boolean isVipVert = (row > topBound && row < bottomBound);

                    if (isVipHoriz && isVipVert) {
                        seat.setSeatType(SeatType.VIP);
                    } else {
                        seat.setSeatType(SeatType.NORMAL);
                    }
                }

                seat.setRoom(room);
                seatRepository.save(seat);
            }
        }

        return roomMapper.toResponse(room);
    }

    public List<RoomResponse> getAll() {
        return roomRepository.findAll()
                .stream()
                .map(roomMapper::toResponse)
                .toList();
    }

    public RoomResponse getById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return roomMapper.toResponse(room);
    }
}


