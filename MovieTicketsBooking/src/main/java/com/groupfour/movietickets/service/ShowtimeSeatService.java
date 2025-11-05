package com.groupfour.movietickets.service;

import com.groupfour.movietickets.Exception.AppException;
import com.groupfour.movietickets.Exception.ErrorCode;
import com.groupfour.movietickets.dto.request.ShowtimeSeatCreationRequest;
import com.groupfour.movietickets.dto.request.ShowtimeSeatUpdateRequest;
import com.groupfour.movietickets.dto.response.ShowtimeSeatResponse;
import com.groupfour.movietickets.entity.ShowtimeSeat;
import com.groupfour.movietickets.mapper.ShowtimeSeatMapper;
import com.groupfour.movietickets.repository.ShowtimeSeatRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeSeatService {
    ShowtimeSeatRepository showtimeSeatRepository;
    ShowtimeSeatMapper showtimeSeatMapper;

    public ShowtimeSeatResponse createShowtimeSeat(ShowtimeSeatCreationRequest request){
        ShowtimeSeat showtimeSeat = showtimeSeatMapper.toShowtimeSeat(request);
        return showtimeSeatMapper.toShowtimeSeatResponse(showtimeSeatRepository.save(showtimeSeat));
    }

    public ShowtimeSeatResponse updateShowtimeSeat(String id, ShowtimeSeatUpdateRequest request){
        ShowtimeSeat showtimeSeat = showtimeSeatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_SEAT_NOTFOUND));
        showtimeSeatMapper.updateShowtimeSeat(showtimeSeat, request);
        return showtimeSeatMapper.toShowtimeSeatResponse(showtimeSeatRepository.save(showtimeSeat));
    }


    public void deleteShowtimeSeat(String id){
        showtimeSeatRepository.deleteById(id);
    }

    public List<ShowtimeSeatResponse> getShowtimeSeats(){
        return showtimeSeatRepository.findAll().stream().map(showtimeSeatMapper::toShowtimeSeatResponse).toList();
    }
    public ShowtimeSeatResponse getShowtimeSeatById(String id) {
        return showtimeSeatMapper.toShowtimeSeatResponse(showtimeSeatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_SEAT_NOTFOUND)));
    }
}
