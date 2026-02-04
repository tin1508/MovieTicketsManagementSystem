package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.dto.response.stats.MovieStatsDTO;
import com.moviebooking.movie_service.entity.Booking;
import com.moviebooking.movie_service.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail,String> {
    List<BookingDetail> findAllByShowtimeSeatIdIn(List<String> seatIds);
    void deleteByBookingId(String bookingId);
}
