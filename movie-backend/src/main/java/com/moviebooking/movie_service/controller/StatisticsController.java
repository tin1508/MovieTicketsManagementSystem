package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.response.MovieStatisticsResponse;
import com.moviebooking.movie_service.dto.response.UserStatisticsResponse;
import com.moviebooking.movie_service.repository.BookingDetailRepository;
import com.moviebooking.movie_service.repository.BookingRepository;
import com.moviebooking.movie_service.service.MovieStatisticsService;
import com.moviebooking.movie_service.service.UserStatisticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticsController {
    MovieStatisticsService movieStatisticsService;
    UserStatisticsService userStatisticsService;
    BookingDetailRepository bookingDetailRepository;
    BookingRepository bookingRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllStatistics() {
        MovieStatisticsResponse movieStats = movieStatisticsService.getMovieStatistics();
        UserStatisticsResponse userStats = userStatisticsService.getUserStatistics();

        Map<String, Object> allStats = new HashMap<>();
        allStats.put("movies", movieStats);
        allStats.put("users", userStats);

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .message("Statistics retrieved successfully")
                .result(allStats)
                .build());
    }

    @GetMapping("/movies/by-month")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getMoviesByMonth() {
        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .result(movieStatisticsService.getMoviesByMonth())
                .build());
    }

    @GetMapping("/users/by-month")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUsersByMonth() {
        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .result(userStatisticsService.getUsersByMonth())
                .build());
    }

    @GetMapping("/daily-revenue")
    public ResponseEntity<?> getDailyRevenue(){
        return ResponseEntity.ok(bookingRepository.getDailyRevenueStats());
    }

    @GetMapping("/top-movies")
    public  ResponseEntity<?> getTopMovies(){
        return ResponseEntity.ok(bookingRepository.getTopMovieStats());
    }

    @GetMapping("/movies-revenue")
    public ResponseEntity<?> getAllMovieStats(){
        return ResponseEntity.ok(bookingRepository.getAllMovieStats());
    }
}