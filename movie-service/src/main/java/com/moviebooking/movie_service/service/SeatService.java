package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.SeatUpdateRequest;
import com.moviebooking.movie_service.dto.response.SeatResponse;
import com.moviebooking.movie_service.entity.Room;
import com.moviebooking.movie_service.entity.Seat;
import com.moviebooking.movie_service.entity.SeatType;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.SeatMapper;
import com.moviebooking.movie_service.repository.SeatRepository;
import com.moviebooking.movie_service.repository.SeatTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatService {
    SeatMapper seatMapper;
    SeatTypeRepository seatTypeRepository;
    SeatRepository seatRepository;


    public List<Seat> generateSeats(Room room) {
        List<Seat> seats = new ArrayList<>();

        int totalRows = room.getTotalRows();
        int seatsPerRow = room.getSeatsPerRow();

        SeatType normal = seatTypeRepository.findByName("NORMAL")
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));
        SeatType vip = seatTypeRepository.findByName("VIP")
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));
        SeatType couple = seatTypeRepository.findByName("COUPLE")
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));

        int vipRowStart = totalRows / 3;
        int vipRowEnd = totalRows * 2 / 3;

        int vipColStart = 2;
        int vipColEnd = seatsPerRow - 1;

        for (int i = 0; i < totalRows; i++) {
            char rowChar = (char) ('A' + i);
            boolean isLastRow = (i == totalRows - 1);
            boolean isVipRow = i >= vipRowStart && i < vipRowEnd;

            for (int j = 1; j <= seatsPerRow; j++) {
                SeatType type = normal;

                if (isLastRow) type = couple;
                else if (isVipRow && j > vipColStart && j < vipColEnd)
                    type = vip;

                seats.add(Seat.builder()
                        .seatName(rowChar + String.valueOf(j))
                        .row(String.valueOf(rowChar))
                        .seatNumber(j)
                        .room(room)
                        .seatType(type)
                        .build());
            }
        }
        return seats;
    }

    public SeatResponse updateSeat(Long id, SeatUpdateRequest request){
        Seat seat = seatRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));
        if(request.getSeatType() != null){
            SeatType newType = seatTypeRepository.findByName(request.getSeatType().getName()).orElseThrow(() -> new AppException(ErrorCode.SEAT_TYPE_NOTFOUND));
            seat.setSeatType(newType);
        }
        seatMapper.updateSeat(seat, request);
        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }
    public List<SeatResponse> getSeats(Long roomId){
        return seatRepository.findAllByRoomId(roomId).stream().map(seatMapper::toSeatResponse).toList();
    }
    public SeatResponse getSeatById(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));
        return seatMapper.toSeatResponse(seat);
    }
}
