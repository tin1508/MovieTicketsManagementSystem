package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // Đã import đúng
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);
    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    @Query("""
        SELECT u FROM User u
        WHERE (:role NOT MEMBER OF u.roles)
        AND (
            :keyword IS NULL OR :keyword = '' OR
            LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            u.phoneNumber LIKE CONCAT('%', :keyword, '%')
        )
    """)
    Page<User> searchUsers(@Param("role") String role,
                           @Param("keyword") String keyword,
                           Pageable pageable);



    // Thống kê user theo tháng
    @Query(value = """
        SELECT DATE_FORMAT(create_at, '%Y-%m') as month, COUNT(*) as count
        FROM user
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
    """, nativeQuery = true)
    List<Object[]> countUsersByMonth();

    Optional<User> findByEmail(String email);

    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}