package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Booking;
import com.moviebooking.movie_service.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository  extends JpaRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);

    List<Booking> findAllByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime expiresAtBefore);
}
