package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Movie;
import com.moviebooking.movie_service.enums.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String>, JpaSpecificationExecutor<Movie> {
    boolean existsMovieByTitle(String title);
    boolean existsByGenres_Id(Long genreId);

    long countByMovieStatus(MovieStatus movieStatus);
    @Query(value = "SELECT COALESCE(SUM(view_count), 0) FROM movie", nativeQuery = true)
    Long getTotalViews();

    // Thống kê phim theo tháng (SQL thuần)
    // Trả về: [Tháng (String), Số lượng (Long)]
    @Query(value = """
        SELECT DATE_FORMAT(create_at, '%Y-%m') as month, COUNT(*) as count
        FROM movie
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
    """, nativeQuery = true)
    List<Object[]> countByMonth();
}
