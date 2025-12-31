package com.moviebooking.movie_service.repository;


import com.moviebooking.movie_service.entity.Showtimes;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ShowtimesRepository extends JpaRepository<Showtimes, String> {
    @Query("select distinct s.showtimesDate from Showtimes s where s.movie.id = :movieId " +
            "and s.showtimesDate >= :today " +
            "and s.status = 'SCHEDULED' " +
            "order by s.showtimesDate asc")
    List<LocalDate> findDistinctShowtimeDatesByMovieId(@Param("movieId") String movieId, @Param("today") LocalDate today);

    @Query("select s from Showtimes s where s.movie.id = :movieId and s.showtimesDate = :date and s.status = 'SCHEDULED' and (:date > :today OR (:date = :today AND s.startTime > :currentTime)) " +
            "order by s.startTime asc")
    List<Showtimes> findByMovieIdAndShowtimesDate(@Param("movieId") String movieId, LocalDate date, @Param("today") LocalDate today, @Param("currentTime") LocalTime currentTime);

    boolean existsByMovieId(String movieId);
    boolean existsByRoomId(Long roomId);

    @Modifying
    @Transactional
    @Query("UPDATE Showtimes s SET s.status = 'ENDED' " +
            "WHERE s.status <> 'ENDED' " +
            "AND (" +
            "   s.showtimesDate < :today " +
            "   OR " +
            "   (s.showtimesDate = :today AND s.endTime < :currentTime) " +
            ")")
    int updateExpiredShowtimes(@Param("today") LocalDate today,
                               @Param("currentTime")LocalTime currentTime);
    @Modifying
    @Transactional
    @Query("UPDATE Showtimes s SET s.status = 'NOW_SHOWING' " +
            "WHERE s.status = 'SCHEDULED' " +
            "AND s.showtimesDate = :today " +
            "AND s.startTime <= :currentTime " +
            "AND s.endTime > :currentTime")
    int updateOngoingShowtimes(@Param("today") LocalDate today,
                               @Param("currentTime") LocalTime currentTime);
}