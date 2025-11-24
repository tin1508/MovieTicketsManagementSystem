package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    /**
     * Số user mới theo tháng
     */
    @Query(value = """
        SELECT DATE_FORMAT(create_at, '%Y-%m') as month, COUNT(*) as count
        FROM user
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
    """, nativeQuery = true)
    List<Object[]> countUsersByMonth();
}