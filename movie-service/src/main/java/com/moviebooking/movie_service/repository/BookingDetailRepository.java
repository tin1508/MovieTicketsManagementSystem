package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail,String> {
}
