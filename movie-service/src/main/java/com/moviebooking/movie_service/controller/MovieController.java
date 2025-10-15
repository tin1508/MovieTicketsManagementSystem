package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.ApiResponse;
import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.service.MovieService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {
    MovieService movieService;

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

    @GetMapping("/movies")
    ApiResponse<List<MovieResponse>> getAllMovies(){
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getAllMovies())
                .build();
    }

    @PutMapping("/{movieId}")
    ApiResponse<MovieResponse> updateMovie(@PathVariable String movieId, @RequestBody MovieUpdateRequest request){
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.updateMovie(movieId,request ))
                .build();
    }

}
