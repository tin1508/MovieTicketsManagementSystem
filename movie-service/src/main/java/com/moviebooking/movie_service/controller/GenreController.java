package com.moviebooking.movie_service.controller;

import com.moviebooking.movie_service.dto.request.GenreUpdateRequest;
import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.request.GenreCreationRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.service.GenreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RestController
@RequestMapping("/genres")
public class GenreController {
    GenreService genreService;

    @PostMapping
    ApiResponse<GenreResponse> createGenre(@RequestBody GenreCreationRequest request){
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.createGenre(request))
                .build();
    }

    @DeleteMapping("/{genreId}")
    ApiResponse<String> deleteGenre(@PathVariable Long genreId){
        genreService.deleteGenre(genreId);
        return ApiResponse.<String>builder()
                .result("Genre has been removed")
                .build();
    }

    @GetMapping("/{genreId}")
    ApiResponse<GenreResponse> getGenre(@PathVariable Long genreId){
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.getGenre(genreId))
                .build();
    }

    @GetMapping
    ApiResponse<List<GenreResponse>> getAllGenres(){
        return ApiResponse.<List<GenreResponse>>builder()
                .result(genreService.getAllGenres())
                .build();
    }

    @PatchMapping("/{genreId}")
    ApiResponse<GenreResponse> updateGenre(@PathVariable Long genreId, GenreUpdateRequest request){
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.updateGenre(genreId, request))
                .build();
    }
}
