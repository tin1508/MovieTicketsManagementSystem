package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Room;
import com.moviebooking.movie_service.entity.Showtimes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimesRepository extends JpaRepository<Showtimes, String> {
    @Query("select distinct s.showtimesDate from Showtimes s where s.movie.id = :movieId")
    List<LocalDate> findDistinctShowtimeDatesByMovieId(@Param("movieId") String movieId);

    @Query("select s from Showtimes s where s.movie.id = :movieId and s.showtimesDate = :date")
    List<Showtimes> findByMovieIdAndShowtimesDate(@Param("movieId") String movieId, LocalDate date);

    boolean existsByMovieId(String movieId);
    boolean existsByRoomId(Long roomId);

}