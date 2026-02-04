package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.RoomCreationRequest;
import com.moviebooking.movie_service.dto.request.RoomUpdateRequest;
import com.moviebooking.movie_service.dto.response.RoomResponse;
import com.moviebooking.movie_service.entity.Cinema;
import com.moviebooking.movie_service.entity.Room;
import com.moviebooking.movie_service.entity.Seat;
import com.moviebooking.movie_service.enums.RoomStatus;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.RoomMapper;
import com.moviebooking.movie_service.repository.CinemaRepository;
import com.moviebooking.movie_service.repository.RoomRepository;
import com.moviebooking.movie_service.repository.ShowtimesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService {
    RoomRepository roomRepository;
    RoomMapper roomMapper;
    CinemaRepository cinemaRepository;
    SeatService seatService;
    ShowtimesRepository showtimesRepository;

    public RoomResponse createRoom(RoomCreationRequest request) {
        Room room = roomMapper.toRoom(request);
        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOTFOUND));
        room.setCinema(cinema);
        cinema.getRooms().add(room);
        room.setTotalRows(10);
        room.setSeatsPerRow(12);
        room.setTotalSeats(room.getTotalRows() * room.getSeatsPerRow());
        String nextName = generateNextRoomName(cinema.getRooms());
        room.setName(nextName);
        List<Seat> seats = seatService.generateSeats(room);
        room.setSeats(seats);
        room.setStatus(RoomStatus.AVAILABLE);
        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

    public RoomResponse updateRoom(Long id, RoomUpdateRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOTFOUND));
        roomMapper.updateRoom(room, request);
        if(request.getStatus() != null){
            room.setStatus(request.getStatus());
        }
        return roomMapper.toRoomResponse(roomRepository.save(room));
    }
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOTFOUND));
        boolean hasShowtimes = showtimesRepository.existsByRoomId(room.getId());
        if(!hasShowtimes){
            roomRepository.deleteById(room.getId());
            Cinema cinema = room.getCinema();
            cinema.getRooms().remove(room);
        }
        else throw new AppException(ErrorCode.SHOWTIMES_EXIST);
    }
    public RoomResponse getRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOTFOUND));
        return roomMapper.toRoomResponse(room);
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream().map(roomMapper::toRoomResponse).toList();
    }
    private String generateNextRoomName(List<Room> rooms){
        Set<Integer> existingNumbers = new HashSet<>();
        for (Room r : rooms){
            if(r.getName() != null && r.getName().matches("^R\\d+$")){
                try{
                    int currentNumber = Integer.parseInt(r.getName().substring(1));
                    existingNumbers.add(currentNumber);
                }catch (NumberFormatException e){

                }
            }
        }
        int nextNumber = 1;
        while(true){
            if(!existingNumbers.contains(nextNumber)){
                return "R" + nextNumber;
            }
            nextNumber++;
        }
    }
}