package com.moviebooking.movie_service.service;

import com.moviebooking.movie_service.dto.response.ApiResponse;
import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieFilterRequest;
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
import jakarta.persistence.criteria.JoinType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        movie.setMovieStatus(request.getMovieStatus());

        log.info("Request genreIds nhận được: {}", request.getGenreIds());

        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()){
            log.info("ĐÃ ĐI VÀO KHỐI IF. Số lượng genreIds: {}", request.getGenreIds().size());

            List<Genre> genreList = genreRepository.findAllById(request.getGenreIds());

            if (genreList.size() != request.getGenreIds().size()){
                throw new AppException(ErrorCode.GENRE_NOT_FOUND);
            }

            Set<Genre> genres = new HashSet<>(genreList);
            movie.setGenres(genres);
        }

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    public MovieResponse getMovie(String id){
        return movieMapper.toMovieResponse(
                movieRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND)));
    }

    public void deleteMovie(String id){
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movieRepository.delete(movie);
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

        if (request.getTrailerUrl() != null){
            if (request.getTrailerUrl().isEmpty()){
                movie.setTrailerUrl(null);
            } else {
                movie.setTrailerUrl(request.getTrailerUrl());
            }
        }

        movieMapper.updateMovie(movie, request);

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }


    public Page<MovieResponse> searchAndFilterMovies(MovieFilterRequest request, Pageable pageable){
        if(pageable.getSort().isUnsorted()){
            pageable = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by("createAt").descending()
            );
        }
        Specification<Movie> specification = buildSpecification(request);
        Page<Movie> movies = movieRepository.findAll(specification, pageable);

        return movies.map(movieMapper::toMovieResponse);
    }

    public Specification<Movie> buildSpecification(MovieFilterRequest request){
        Specification<Movie> specification = Specification.unrestricted();

        specification = specification.and(MovieSpecification.isActive());

        if (request.getKeyword() != null && !request.getKeyword().isEmpty()){
            specification = specification.and(MovieSpecification.hasKeyword(request.getKeyword()));
        }

        if (request.getAgeRating() != null){
            specification = specification.and(MovieSpecification.hasAgeRating(request.getAgeRating()));
        }

        if (request.getMovieStatus() != null){
            specification = specification.and(MovieSpecification.hasStatus(request.getMovieStatus()));
        }

        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()){
            specification = specification.and(MovieSpecification.hasGenres(request.getGenreIds()));
        }

        if (request.getMinRating() != null || request.getMaxRating() != null){
            specification = specification.and(MovieSpecification.ratingBetween(
                    request.getMinRating(), request.getMaxRating()));
        }

        if (request.getYear() != null){
            specification = specification.and(MovieSpecification.relaseAfterOn(request.getYear()));
        }

        return specification;
    }

}
