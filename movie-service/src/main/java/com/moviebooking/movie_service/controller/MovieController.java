package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieFilterRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Movie;
import com.moviebooking.movie_service.enums.MovieStatus;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.repository.MovieRepository;
import com.moviebooking.movie_service.service.FileStorageService;
import com.moviebooking.movie_service.service.MovieService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {
    MovieService movieService;
    FileStorageService fileStorageService;
    MovieRepository movieRepository;

    @PostMapping
    ApiResponse<MovieResponse> createMovie(@RequestBody @Valid MovieCreationRequest request){
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.createMovie(request))
                .build();
    }

    @GetMapping("/{movieId}")
    ApiResponse<MovieResponse> getMovie(@PathVariable("movieId") String movieId){
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.getMovie(movieId))
                .build();
    }

    @DeleteMapping("/{movieId}")
    ApiResponse<String> deleteMovie(@PathVariable String movieId){
        movieService.deleteMovie(movieId);
        return ApiResponse.<String>builder()
                .result("Movie has been deleted!")
                .build();
    }

    @PatchMapping("/{movieId}")
    ApiResponse<MovieResponse> updateMovie(@PathVariable String movieId, @RequestBody @Valid MovieUpdateRequest request){
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.updateMovie(movieId,request))
                .build();
    }

    @GetMapping
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

        Pageable pageable = PageRequest.of(page, size, Sort.by("releaseDate").ascending());

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

    @PostMapping("/{id}/poster")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadPoster(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file
            ) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (movie.getPosterUrl() != null){
            fileStorageService.deleteFile(movie.getPosterUrl());
        }

        // Upload file mới
        String fileUrl = fileStorageService.uploadFile(file, "posters");

        // Update movie
        movie.setPosterUrl(fileUrl);
        movieRepository.save(movie);

        // Build response
        Map<String, String> data = new HashMap<>();
        data.put("url", fileUrl);

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .message("Poster uploaded successfully")
                .result(data)
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}/poster")
    public ResponseEntity<ApiResponse<Void>> deletePoster(@PathVariable String id){
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (movie.getPosterUrl() != null){
            fileStorageService.deleteFile(movie.getPosterUrl());
            movie.setPosterUrl(null);
            movieRepository.save(movie);
        }

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Poster deleted successfully")
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("{id}/trailer")
    public ResponseEntity<ApiResponse<Void>> deleteTrailer(@PathVariable String id){
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (movie.getTrailerUrl() != null){
            movie.setTrailerUrl(null);
            movieRepository.save(movie);
        }

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .message("Trailer deleted successfully")
                .build();

        return ResponseEntity.ok(response);
    }
}

