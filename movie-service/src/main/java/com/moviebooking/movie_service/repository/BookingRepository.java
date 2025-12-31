package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.dto.response.stats.MovieStatsDTO;
import com.moviebooking.movie_service.dto.response.stats.RevenueStatsDTO;
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
    List<Booking> findByUserIdOrderByBookingDate(String userId);

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

    @Query(value = """
        SELECT 
            DATE_FORMAT(b.booking_date, '%d/%m') as date, 
            CAST(SUM(b.total_price) AS DOUBLE) as revenue, 
            CAST(COUNT(bd.id) AS SIGNED) as ticketCount 
        FROM bookings b
        JOIN booking_details bd ON b.id = bd.booking_id
        WHERE b.status = 'CONFIRMED' 
        GROUP BY DATE_FORMAT(b.booking_date, '%d/%m'), DATE(b.booking_date)
        ORDER BY DATE(b.booking_date) ASC
        LIMIT 7
        """, nativeQuery = true)
    List<RevenueStatsDTO> getDailyRevenueStats();

    @Query(value = """
        SELECT 
            m.title as movieName, 
            SUM(bd.price) as revenue, 
            COUNT(bd.id) as ticketCount 
        FROM bookings b
        JOIN booking_details bd ON b.id = bd.booking_id
        JOIN showtime_seats ss ON bd.showtime_seat_id = ss.id
        JOIN showtimes s ON ss.showtime_id = s.id
        JOIN movie m ON s.movie_id = m.id -- Đã sửa: movies -> movie
        WHERE b.status = 'CONFIRMED'
        GROUP BY m.id, m.title
        ORDER BY revenue DESC
        """, nativeQuery = true)
    List<MovieStatsDTO> getAllMovieStats();

    @Query(value = """
        SELECT 
            m.title as movieName, 
            SUM(bd.price) as revenue, 
            COUNT(bd.id) as ticketCount 
        FROM bookings b
        JOIN booking_details bd ON b.id = bd.booking_id
        JOIN showtime_seats ss ON bd.showtime_seat_id = ss.id
        JOIN showtimes s ON ss.showtime_id = s.id
        JOIN movie m ON s.movie_id = m.id
        WHERE b.status = 'CONFIRMED'
        GROUP BY m.id, m.title
        ORDER BY revenue DESC
        LIMIT 5
        """, nativeQuery = true)
    List<MovieStatsDTO> getTopMovieStats();
}