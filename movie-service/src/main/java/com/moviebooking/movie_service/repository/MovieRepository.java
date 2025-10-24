package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String>, JpaSpecificationExecutor<Movie> {
    boolean existsMovieByTitle(String title);
    boolean existsByGenres_Id(Long genreId);
}
