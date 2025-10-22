package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.MovieFilterRequest;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.enums.MovieStatus;
import com.moviebooking.movie_service.service.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieFilterController {
    MovieService movieService;

    @GetMapping("/filter")
    public ResponseEntity<Page<MovieResponse>> filterMovies(
            @ModelAttribute MovieFilterRequest movieFilterRequest,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "releaseDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
            ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<MovieResponse> result = movieService.searchAndFilterMovies(movieFilterRequest, pageable);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MovieResponse>> searchMovies(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
            ) {
        MovieFilterRequest movieFilterRequest = new MovieFilterRequest();
        movieFilterRequest.setKeyword(keyword);

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                movieService.searchAndFilterMovies(movieFilterRequest, pageable));
    }

    @GetMapping("/now-showing")
    public ResponseEntity<Page<MovieResponse>> getNowShowingMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
            ) {
        MovieFilterRequest movieFilterRequest = new MovieFilterRequest();
        movieFilterRequest.setMovieStatus(MovieStatus.NOW_SHOWING);

        Pageable pageable = PageRequest.of(page, size, Sort.by("releaseData").ascending());

        return ResponseEntity.ok(
                movieService.searchAndFilterMovies(movieFilterRequest, pageable));
    }

    @GetMapping("/by-genre/{genreId}")
    public ResponseEntity<Page<MovieResponse>> getMoviesByGenre(
            @PathVariable Long genreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        MovieFilterRequest movieFilterRequest = new MovieFilterRequest();
        movieFilterRequest.setGenreId(genreId);

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(movieService.searchAndFilterMovies(movieFilterRequest, pageable));
    }

    @GetMapping("/top-rated")
    public  ResponseEntity<Page<MovieResponse>> getTopRatedMovies(
            @RequestParam(defaultValue = "10") int limit
    ) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("rating").descending());

        MovieFilterRequest movieFilterRequest = new MovieFilterRequest();

        movieFilterRequest.setMinRating(0.0);

        return  ResponseEntity.ok(movieService.searchAndFilterMovies(movieFilterRequest, pageable));
    }
}
