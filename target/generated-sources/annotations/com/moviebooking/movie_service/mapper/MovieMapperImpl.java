package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.entity.Movie;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class MovieMapperImpl implements MovieMapper {

    @Override
    public Movie toMovie(MovieCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Movie movie = new Movie();

        movie.setTitle( request.getTitle() );
        movie.setDirector( request.getDirector() );
        movie.setDescription( request.getDescription() );
        movie.setDuration( request.getDuration() );
        movie.setRating( request.getRating() );
        movie.setReleaseDate( request.getReleaseDate() );
        movie.setPosterUrl( request.getPosterUrl() );
        movie.setTrailerUrl( request.getTrailerUrl() );
        movie.setAgeRating( request.getAgeRating() );
        movie.setMovieStatus( request.getMovieStatus() );

        return movie;
    }

    @Override
    public MovieResponse toMovieResponse(Movie movie) {
        if ( movie == null ) {
            return null;
        }

        MovieResponse.MovieResponseBuilder movieResponse = MovieResponse.builder();

        movieResponse.id( movie.getId() );
        movieResponse.title( movie.getTitle() );
        movieResponse.director( movie.getDirector() );
        movieResponse.description( movie.getDescription() );
        movieResponse.duration( movie.getDuration() );
        movieResponse.rating( movie.getRating() );
        movieResponse.releaseDate( movie.getReleaseDate() );
        movieResponse.posterUrl( movie.getPosterUrl() );
        movieResponse.trailerUrl( movie.getTrailerUrl() );
        movieResponse.ageRating( movie.getAgeRating() );
        movieResponse.movieStatus( movie.getMovieStatus() );
        movieResponse.genres( genreSetToGenreResponseSet( movie.getGenres() ) );

        return movieResponse.build();
    }

    @Override
    public GenreResponse toGenreResponse(Genre genre) {
        if ( genre == null ) {
            return null;
        }

        GenreResponse.GenreResponseBuilder genreResponse = GenreResponse.builder();

        genreResponse.name( genre.getName() );
        genreResponse.description( genre.getDescription() );

        return genreResponse.build();
    }

    @Override
    public void updateMovie(Movie movie, MovieUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        movie.setTitle( request.getTitle() );
        movie.setDirector( request.getDirector() );
        movie.setDescription( request.getDescription() );
        movie.setDuration( request.getDuration() );
        movie.setRating( request.getRating() );
        movie.setReleaseDate( request.getReleaseDate() );
        movie.setPosterUrl( request.getPosterUrl() );
        movie.setTrailerUrl( request.getTrailerUrl() );
        movie.setAgeRating( request.getAgeRating() );
        movie.setMovieStatus( request.getMovieStatus() );
    }

    protected Set<GenreResponse> genreSetToGenreResponseSet(Set<Genre> set) {
        if ( set == null ) {
            return null;
        }

        Set<GenreResponse> set1 = new LinkedHashSet<GenreResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Genre genre : set ) {
            set1.add( toGenreResponse( genre ) );
        }

        return set1;
    }
}
