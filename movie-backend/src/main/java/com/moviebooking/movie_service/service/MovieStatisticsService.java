package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.response.MovieStatisticsResponse;
import com.moviebooking.movie_service.enums.MovieStatus;
import com.moviebooking.movie_service.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieStatisticsService {
    MovieRepository movieRepository;

    public MovieStatisticsResponse getMovieStatistics(){
        log.info("Getting movie statistics");

        long totalMovies = movieRepository.count();
        long nowShowingCount = movieRepository.countByMovieStatus(MovieStatus.NOW_SHOWING);
        long comingSoonCount = movieRepository.countByMovieStatus(MovieStatus.COMING_SOON);
        long endedCount = movieRepository.countByMovieStatus(MovieStatus.ENDED);

        Long totalViews = movieRepository.getTotalViews();

        return MovieStatisticsResponse.builder()
                .totalMovies(totalMovies)
                .nowShowingCount(nowShowingCount)
                .comingSoonCount(comingSoonCount)
                .endedCount(endedCount)
                .totalViews(totalViews != null ? totalViews : 0L)
                .build();
    }

    public Map<String, Long> getMoviesByMonth(){
        List<Object[]> results = movieRepository.countByMonth();

        Map<String, Long> moviesByMonth = new TreeMap<>();
        for (Object[] result : results){
            if (result[0] != null) {
                String month = result[0].toString();
                Long count = ((Number) result[1]).longValue();
                moviesByMonth.put(month, count);
            }
        }

        return moviesByMonth;
    }

}
