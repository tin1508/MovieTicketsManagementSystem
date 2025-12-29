package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.response.ShowtimeSeatResponse;
import com.moviebooking.movie_service.entity.Seat;
import com.moviebooking.movie_service.entity.ShowtimeSeat;
import com.moviebooking.movie_service.entity.Showtimes;
import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.ShowtimeSeatMapper;
import com.moviebooking.movie_service.repository.SeatRepository;
import com.moviebooking.movie_service.repository.ShowtimeSeatRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeSeatService {
    ShowtimeSeatRepository showtimeSeatRepository;
    SeatRepository seatRepository;
    ShowtimeSeatMapper showtimeSeatMapper;

    @Transactional
    public void generateShowtimeSeats(Showtimes showtime){
        List<Seat> seats = seatRepository.findAllByRoomId(showtime.getRoom().getId());
        List<ShowtimeSeat> showtimeSeats = seats.stream()
                .map(seat -> ShowtimeSeat.builder()
                        .showtimes(showtime)
                        .seat(seat)
                        .status(ShowtimeSeatStatus.AVAILABLE)
                        .build()
                ).toList();

        showtimeSeatRepository.saveAll(showtimeSeats);
    }
    public List<ShowtimeSeatResponse> getSeatsByShowtime(String showtimeId) {
        return showtimeSeatRepository.findByShowtimesId(showtimeId)
                .stream()
                .map(showtimeSeatMapper::toShowtimeSeatResponse)
                .toList();
    }
    @Transactional
    public void holdSeats(String showtimeId, List<Long> seatIds, String holderId) {

        List<ShowtimeSeat> seats =
                showtimeSeatRepository.findByShowtimesIdAndSeatIdIn(showtimeId, seatIds);

        for (ShowtimeSeat seat : seats) {
            if (seat.getStatus() != ShowtimeSeatStatus.AVAILABLE) {
                boolean isHeldByMe = seat.getStatus() == ShowtimeSeatStatus.HOLDING
                        && holderId.equals(seat.getHoldBy());
                if (!isHeldByMe) {
                    throw new AppException(ErrorCode.SEAT_ALREADY_TAKEN);
                }
            }
            seat.setStatus(ShowtimeSeatStatus.HOLDING);
            seat.setHoldBy(holderId);
            seat.setHoldExpiredAt(LocalDateTime.now().plusMinutes(5));
        }
        showtimeSeatRepository.saveAll(seats);
    }
    @Transactional
    public void releaseSeats(String showtimeId, List<Long> seatIds, String holderId) {

        List<ShowtimeSeat> seats =
                showtimeSeatRepository.findByShowtimesIdAndSeatIdIn(showtimeId, seatIds);

        for (ShowtimeSeat seat : seats) {
            if (seat.getStatus() == ShowtimeSeatStatus.HOLDING &&
                    holderId.equals(seat.getHoldBy())) {
                seat.setStatus(ShowtimeSeatStatus.AVAILABLE);
                seat.setHoldBy(null);
                seat.setHoldExpiredAt(null);
            }
        }
    }
    @Scheduled(fixedRate = 30000)
    @Transactional
    public void autoReleaseExpiredSeats(){
        List<ShowtimeSeat> expiredSeats = showtimeSeatRepository
                .findAllByStatusAndHoldExpiredAtBefore(
                        ShowtimeSeatStatus.HOLDING,
                        LocalDateTime.now()
                );
        if(!expiredSeats.isEmpty()){
            for(ShowtimeSeat seat : expiredSeats){
                seat.setStatus(ShowtimeSeatStatus.AVAILABLE);
                seat.setHoldBy(null);
                seat.setHoldExpiredAt(null);
            }
            showtimeSeatRepository.saveAll(expiredSeats);
            System.out.println("Đã tự động nhả " + expiredSeats.size() + " ghế hết hạn.");
        }
    }
    public List<ShowtimeSeatResponse> getShowtimeSeats(){
        return showtimeSeatRepository.findAll().stream().map(showtimeSeatMapper::toShowtimeSeatResponse).toList();
    }
}

