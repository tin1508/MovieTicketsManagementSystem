package com.moviebooking.movie_service.mapper;

import com.moviebooking.movie_service.dto.request.GenreCreationRequest;
import com.moviebooking.movie_service.dto.request.GenreUpdateRequest;
import com.moviebooking.movie_service.dto.response.GenreResponse;
import com.moviebooking.movie_service.entity.Genre;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class GenreMapperImpl implements GenreMapper {

    @Override
    public Genre toGenre(GenreCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Genre genre = new Genre();

        genre.setName( request.getName() );
        genre.setDescription( request.getDescription() );

        return genre;
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
    public void updateGenre(Genre genre, GenreUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        genre.setName( request.getName() );
        genre.setDescription( request.getDescription() );
    }
}
