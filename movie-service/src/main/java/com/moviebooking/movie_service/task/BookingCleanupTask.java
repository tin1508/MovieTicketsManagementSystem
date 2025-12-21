package com.moviebooking.movie_service.task;

import com.moviebooking.movie_service.entity.Booking;
import com.moviebooking.movie_service.entity.BookingDetail;
import com.moviebooking.movie_service.entity.ShowtimeSeat;
import com.moviebooking.movie_service.enums.BookingStatus;
import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import com.moviebooking.movie_service.repository.BookingRepository;
import com.moviebooking.movie_service.repository.ShowtimeSeatRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingCleanupTask {
    BookingRepository bookingRepository;
    ShowtimeSeatRepository showtimeSeatRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void cleanupExpiredBookings(){
        log.info("Starting cleanup for expired bookings...");
        List<Booking> expiredBookings = bookingRepository.findAllByStatusAndExpiresAtBefore(BookingStatus.PENDING, LocalDateTime.now());
        if(expiredBookings.isEmpty()){
            return;
        }
        for(Booking booking : expiredBookings){
            log.info("Expiring Booking ID: {} - Code: {}", booking.getId(), booking.getBookingCode());
            booking.setStatus(BookingStatus.CANCELLED);
            for(BookingDetail detail : booking.getBookingDetails()){
                ShowtimeSeat seat = detail.getShowtimeSeat();
                seat.setStatus(ShowtimeSeatStatus.AVAILABLE);
                showtimeSeatRepository.save(seat);
            }
            bookingRepository.save(booking);
            log.info("Cleanup finished. Released {} bookings.", expiredBookings.size());
        }
    }

}
