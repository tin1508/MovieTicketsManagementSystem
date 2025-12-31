package com.moviebooking.movie_service.task;

import com.moviebooking.movie_service.repository.ShowtimesRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimesCleanupTask {
    ShowtimesRepository showtimesRepository;
    @Scheduled(fixedRate = 60000, initialDelay = 5000)
    public void autoUpdateShowtimesStatuses()
    {
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zoneId);
        LocalTime now = LocalTime.now(zoneId);

        try{
            //activate film
            int activatedCount = showtimesRepository.updateOngoingShowtimes(today, now);
            if(activatedCount > 0) {
                log.info("Task Scheduler: Đã chuyển {} suất chiếu sang trạng thái NOW_SHOWING (Đang chiếu).", activatedCount);
            }
            int expiredCount = showtimesRepository.updateExpiredShowtimes(today, now);
            if (expiredCount > 0) {
                log.info("Task Scheduler: Đã cập nhật {} suất chiếu sang trạng thái ENDED (Đã kết thúc).", expiredCount);
            }
        }catch (Exception ex){
            log.error("Lỗi khi quét và cập nhật suất chiếu: ", ex);
        }
    }
}