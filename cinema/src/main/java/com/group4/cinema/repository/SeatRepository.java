package com.group4.cinema.repository;

import com.group4.cinema.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, String > {
    List<Seat> findByRoomId(String roomId);
}
