package com.moviebooking.movie_service.repository;

import com.moviebooking.movie_service.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findGenreById(Long id);

    boolean existsByName(String name);

    boolean existsGenreByName(String name);
}
