package com.groupfour.movietickets.repository;

import com.groupfour.movietickets.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository  extends JpaRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);
}
