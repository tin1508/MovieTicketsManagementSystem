package com.groupfour.movietickets.repository;

import com.groupfour.movietickets.entity.ShowtimeSeat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, String> {
//    @Lock(LockModeType.PESSIMISTIC_WRITE)
//    @Query("SELECT s FROM ShowtimeSeat s WHERE ")
}
