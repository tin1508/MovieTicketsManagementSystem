package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.request.ApiResponse;
import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.entity.Movie;
import com.moviebooking.movie_service.exception.AppException;
import com.moviebooking.movie_service.exception.ErrorCode;
import com.moviebooking.movie_service.mapper.MovieMapper;
import com.moviebooking.movie_service.repository.GenreRepository;
import com.moviebooking.movie_service.repository.MovieRepository;
import com.moviebooking.movie_service.specification.MovieSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MovieService {
    MovieRepository movieRepository;
    GenreRepository genreRepository;
    MovieMapper movieMapper;

    public MovieResponse createMovie(MovieCreationRequest request){
        if(movieRepository.existsMovieByTitle(request.getTitle()))
            throw new AppException(ErrorCode.MOVIE_EXIST);

        Movie movie = movieMapper.toMovie(request);

        log.info("Request genreIds nhận được: {}", request.getGenreIds());

        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()){
            log.info("ĐÃ ĐI VÀO KHỐI IF. Số lượng genreIds: {}", request.getGenreIds().size());

            Set<Genre> genres = new HashSet<>();
            for (Long genreId: request.getGenreIds()){
                Genre genre = genreRepository.findById(genreId)
                        .orElseThrow(() -> new AppException((ErrorCode.GENRE_NOT_FOUND)));
                genres.add(genre);
            }
            movie.setGenres(genres);
        }

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
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (request.getGenreIds() != null){
            if (request.getGenreIds().isEmpty()){
                movie.getGenres().clear();
            } else {
                List<Genre> genreList = genreRepository.findAllById(request.getGenreIds());

                if (genreList.size() != request.getGenreIds().size()){
                    throw new AppException(ErrorCode.GENRE_NOT_FOUND);
                }

                Set<Genre> genres = new HashSet<>(genreList);

                movie.setGenres(genres);
            }
        }

        movieMapper.updateMovie(movie, request);

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    public ApiResponse<List<MovieResponse>> searchMovie(String keyword, Integer year){
        Specification<Movie> specification = Specification.unrestricted();

        if (keyword != null && !keyword.isEmpty()){
            specification = specification.and(MovieSpecification.titleContains(keyword));
        }

        if (year != null){
            specification = specification.and(MovieSpecification.relaseAfterOn(year));
        }

        List<Movie> movies = movieRepository.findAll(specification);

        List<MovieResponse> movieResponses = movies.stream().map(movieMapper::toMovieResponse).toList();

        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieResponses)
                .build();
    }

}
