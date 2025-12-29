package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Booking;
import com.moviebooking.movie_service.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository  extends JpaRepository<Booking, String> {
    boolean existsByBookingCode(String bookingCode);

    List<Booking> findAllByStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime expiresAtBefore);

    @Query("""
           select b from Booking b
           join fetch b.showtimes""")
    List<Booking> findAllWithShowtimes();

    @Query("""
         SELECT DISTINCT b FROM Booking b
         JOIN FETCH b.bookingDetails bd
         JOIN FETCH bd.showtimeSeat ss
         JOIN FETCH ss.seat
         WHERE b.id = :id
        """)
    Optional<Booking> findByIdFullInfo(@Param("id") String id);
}
