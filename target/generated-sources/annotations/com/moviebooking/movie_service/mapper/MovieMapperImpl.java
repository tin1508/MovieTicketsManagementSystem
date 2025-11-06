package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.MovieCreationRequest;
import com.moviebooking.movie_service.dto.request.MovieUpdateRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.dto.response.MovieResponse;
import com.moviebooking.movie_service.entity.Genre;
import com.moviebooking.movie_service.entity.Movie;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class MovieMapperImpl implements MovieMapper {

    private final DatatypeFactory datatypeFactory;

    public MovieMapperImpl() {
        try {
            datatypeFactory = DatatypeFactory.newInstance();
        }
        catch ( DatatypeConfigurationException ex ) {
            throw new RuntimeException( ex );
        }
    }

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
        movieResponse.createAt( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( movie.getCreateAt() ) ) );
        movieResponse.updateAt( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( movie.getUpdateAt() ) ) );

        return movieResponse.build();
    }

    @Override
    public GenreResponse toGenreResponse(Genre genre) {
        if ( genre == null ) {
            return null;
        }

        GenreResponse.GenreResponseBuilder genreResponse = GenreResponse.builder();

        genreResponse.id( genre.getId() );
        genreResponse.name( genre.getName() );
        genreResponse.description( genre.getDescription() );

        return genreResponse.build();
    }

    @Override
    public void updateMovie(Movie movie, MovieUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getTitle() != null ) {
            movie.setTitle( request.getTitle() );
        }
        if ( request.getDirector() != null ) {
            movie.setDirector( request.getDirector() );
        }
        if ( request.getDescription() != null ) {
            movie.setDescription( request.getDescription() );
        }
        if ( request.getDuration() != null ) {
            movie.setDuration( request.getDuration() );
        }
        if ( request.getReleaseDate() != null ) {
            movie.setReleaseDate( request.getReleaseDate() );
        }
        if ( request.getPosterUrl() != null ) {
            movie.setPosterUrl( request.getPosterUrl() );
        }
        if ( request.getTrailerUrl() != null ) {
            movie.setTrailerUrl( request.getTrailerUrl() );
        }
        if ( request.getAgeRating() != null ) {
            movie.setAgeRating( request.getAgeRating() );
        }
        if ( request.getMovieStatus() != null ) {
            movie.setMovieStatus( request.getMovieStatus() );
        }
    }

    private XMLGregorianCalendar localDateTimeToXmlGregorianCalendar( LocalDateTime localDateTime ) {
        if ( localDateTime == null ) {
            return null;
        }

        return datatypeFactory.newXMLGregorianCalendar(
            localDateTime.getYear(),
            localDateTime.getMonthValue(),
            localDateTime.getDayOfMonth(),
            localDateTime.getHour(),
            localDateTime.getMinute(),
            localDateTime.getSecond(),
            localDateTime.get( ChronoField.MILLI_OF_SECOND ),
            DatatypeConstants.FIELD_UNDEFINED );
    }

    private static LocalDate xmlGregorianCalendarToLocalDate( XMLGregorianCalendar xcal ) {
        if ( xcal == null ) {
            return null;
        }

        return LocalDate.of( xcal.getYear(), xcal.getMonth(), xcal.getDay() );
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
