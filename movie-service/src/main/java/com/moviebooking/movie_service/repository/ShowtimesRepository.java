package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Showtimes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowtimesRepository extends JpaRepository<Showtimes,Integer> {
}
