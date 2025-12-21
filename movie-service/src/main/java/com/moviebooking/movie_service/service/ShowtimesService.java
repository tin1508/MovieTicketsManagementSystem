package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.ShowtimesCreationRequest;
import com.moviebooking.movie_service.dto.request.ShowtimesUpdateRequest;
import com.moviebooking.movie_service.dto.response.ShowtimesResponse;
import com.moviebooking.movie_service.entity.Movie;
import com.moviebooking.movie_service.entity.Room;
import com.moviebooking.movie_service.entity.Showtimes;
import com.moviebooking.movie_service.enums.ShowtimeStatus;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.ShowtimesMapper;
import com.moviebooking.movie_service.repository.MovieRepository;
import com.moviebooking.movie_service.repository.RoomRepository;
import com.moviebooking.movie_service.repository.ShowtimesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimesService {

    ShowtimesRepository showtimesRepository;
    ShowtimesMapper showtimesMapper;
    MovieRepository movieRepository;
    RoomRepository roomRepository;
    ShowtimeSeatService showtimeSeatService;

    public ShowtimesResponse createShowtimes(ShowtimesCreationRequest request){
        Showtimes showtimes = showtimesMapper.toShowtimes(request);
        Movie movie = movieRepository.findById(request.getMovieId()).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOTFOUND));

        showtimes.setMovie(movie);
        movie.getShowtimes().add(showtimes);
        showtimes.setRoom(room);
        room.getShowtimes().add(showtimes);
        showtimes.setStatus(ShowtimeStatus.SCHEDULED);
        LocalTime calculatedEndtime = calculateCeilingEndTime(request.getStartTime(), movie.getDuration());
        showtimes.setEndTime(calculatedEndtime);
        Showtimes savedShowtime = showtimesRepository.save(showtimes);
        showtimeSeatService.generateShowtimeSeats(savedShowtime);
        return showtimesMapper.toShowtimesResponse(savedShowtime);
    }
    public ShowtimesResponse updateShowtimes(String id, ShowtimesUpdateRequest request){
        Showtimes showtimes = showtimesRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIMES_NOTFOUND));
        showtimesMapper.updateShowtimes(showtimes, request);
        Movie movie = showtimes.getMovie();
        LocalTime newEnd = calculateCeilingEndTime(request.getStartTime(), movie.getDuration());
        showtimes.setEndTime(newEnd);
        return showtimesMapper.toShowtimesResponse(showtimesRepository.save(showtimes));
    }

    public void deleteShowtimes(String id){
        Showtimes showtimes = showtimesRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIMES_NOTFOUND));
        showtimesRepository.deleteById(showtimes.getId());
    }
    public List<ShowtimesResponse> getShowtimes(){
        return showtimesRepository.findAll().stream().map(showtimesMapper::toShowtimesResponse).toList();
    }
    public ShowtimesResponse getShowtimesById(String id){
        return showtimesMapper.toShowtimesResponse(showtimesRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIMES_NOTFOUND)));
    }
    public List<LocalDate> getDatesByMovie(String movieId){
        return showtimesRepository.findDistinctShowtimeDatesByMovieId(movieId);
    }
    public List<ShowtimesResponse> getShowtimesByMovieAnDates(String movieId, LocalDate date){
        return showtimesRepository.findByMovieIdAndShowtimesDate(movieId, date).stream().map(showtimesMapper::toShowtimesResponse).toList();
    }
    private LocalTime calculateCeilingEndTime(LocalTime startTime, Integer duration){
        int totalMinutes = duration + 30;
        LocalTime rawEndTime = startTime.plusMinutes(totalMinutes);
        int minute = rawEndTime.getMinute();
        int remainder = minute % 10;
        if(remainder > 0){
            return rawEndTime.plusMinutes(10 - remainder);
        }
        return rawEndTime;
    }
}
