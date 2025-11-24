package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.ShowtimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat,Integer> {
}
