package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.entity.Movie;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.GenreMapper;
import com.moviebooking.movie_service.mapper.MovieMapper;
import com.moviebooking.movie_service.repository.GenreRepository;
import com.moviebooking.movie_service.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MovieService {
    MovieRepository movieRepository;
    GenreRepository genreRepository;
    MovieMapper movieMapper;
    GenreMapper genreMapper;

    public MovieResponse createMovie(MovieCreationRequest request){
        if(movieRepository.existsMovieByTitle(request.getTitle()))
            throw new AppException(ErrorCode.MOVIE_EXIST);

        HashSet<Genre> genres = new HashSet<>();
//        genreRepository.findGenreById(Predefined)
        Movie movie = movieMapper.toMovie(request);

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    public MovieResponse getMovie(String id){
        return movieMapper.toMovieResponse(
                movieRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND)));
    }

    public void deleteMovie(String id){
        movieRepository.deleteById(id);
    }

    public List<MovieResponse> getAllMovies(){
        return movieRepository.findAll()
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    public MovieResponse updateMovie(String movieId, MovieUpdateRequest request){
        Movie movie = movieRepository.findById(movieId).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        movieMapper.updateMovie(movie, request);
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }



}
