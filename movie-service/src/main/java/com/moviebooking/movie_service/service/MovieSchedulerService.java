package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieSchedulerService {
    MovieRepository movieRepository;

    @Scheduled(cron = "1 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    public void autoUpdateMovieStatus(){
        log.info("⏰ START: Bắt đầu quét phim để cập nhật trạng thái...");

        LocalDate today = LocalDate.now();

        movieRepository.updateMoviesToNowShowing(today);

        log.info("✅ END: Đã cập nhật trạng thái các phim có ngày chiếu <= {}", today);
    }


}
