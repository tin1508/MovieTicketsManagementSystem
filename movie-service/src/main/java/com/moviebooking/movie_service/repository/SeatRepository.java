package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Room;
import com.moviebooking.movie_service.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface SeatRepository extends JpaRepository<Seat,Long> {
    List<Seat> findAllByRoomId(Long roomId);

    Long room(Room room);
}
