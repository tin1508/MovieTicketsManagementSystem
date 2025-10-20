package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String>, JpaSpecificationExecutor<Movie> {
    boolean existsMovieByTitle(String title);

    Optional<Movie> findById(String movieId);
}
