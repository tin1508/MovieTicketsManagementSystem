package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.ShowtimeSeat;
import com.moviebooking.movie_service.enums.ShowtimeSeatStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, String> {
    List<ShowtimeSeat> findByShowtimesId(String showtimeId);
    List<ShowtimeSeat> findByShowtimesIdAndSeatIdIn(String showtimeId, List<Long> seatIds);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<ShowtimeSeat> findByShowtimesIdAndStatus(
            String showtimeId,
            ShowtimeSeatStatus status
    );
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT ss from ShowtimeSeat ss where ss.id in :ids""")
    List<ShowtimeSeat> findByIdsAndLock(@Param("ids") List<String> ids);
    List<ShowtimeSeat> findAllByStatusAndHoldExpiredAtBefore(ShowtimeSeatStatus status, LocalDateTime time);
}