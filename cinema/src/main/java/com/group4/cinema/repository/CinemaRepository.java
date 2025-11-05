package com.group4.cinema.repository;

import com.group4.cinema.entity.Cinema;
import com.group4.cinema.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, String> {
}

